import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryItemsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        name: dto.name,
        code: dto.code,
        unit: dto.unit,
        currentStock: dto.currentStock as any,
        availableStock: dto.currentStock as any,
        criticalLevel: (dto.criticalLevel ?? null) as any,
      },
    });
  }

  findAll() {
    return this.prisma.inventoryItem.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        unit: true,
        currentStock: true,
        criticalLevel: true,
        active: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.inventoryItem.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new NotFoundException('Envanter kalemi bulunamadı');
    return item;
  }

  async update(id: string, dto: UpdateInventoryItemDto) {
    await this.findOne(id);
    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        name: dto.name,
        code: dto.code,
        unit: dto.unit,
        currentStock: (dto.currentStock as any) ?? undefined,
        availableStock: (dto.currentStock as any) ?? undefined,
        criticalLevel: (dto.criticalLevel as any) ?? undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventoryItem.update({
      where: { id },
      data: { deletedAt: new Date(), active: false },
    });
  }

  // Deduct stock for all order items based on product recipes, within an existing transaction
  async deductStockForOrder(orderId: string, branchId: string, userId: string, tx: Prisma.TransactionClient) {
    // 1) Load order items with product and its recipe (and items)
    const orderItems = await tx.orderItem.findMany({
      where: { orderId },
      include: {
        product: {
          include: {
            recipes: {
              include: { items: true },
            },
          },
        },
      },
    });

    // 2) Iterate and deduct inventory for each recipe item
    for (const item of orderItems) {
      const recipe = item.product?.recipes?.[0];
      if (!recipe) continue; // no recipe, nothing to deduct

      for (const rItem of recipe.items) {
        const totalDeduction = (Number(item.quantity) || 0) * Number(rItem.quantity);
        if (!totalDeduction || totalDeduction <= 0) continue;

        // 3) Read inventory item to determine unit and previous stock
        const inv = await tx.inventoryItem.findUnique({ where: { id: rItem.inventoryItemId } });
        if (!inv) continue;
        const prevStock = inv.currentStock as unknown as number;

        // 4) Decrement inventory stock; keep availableStock in sync if applicable
        const updated = await tx.inventoryItem.update({
          where: { id: rItem.inventoryItemId },
          data: {
            currentStock: { decrement: totalDeduction as unknown as any },
            availableStock: { decrement: totalDeduction as unknown as any },
          },
        });

        // 5) Record stock movement for auditing
        await tx.stockMovement.create({
          data: {
            branchId,
            productId: item.productId ?? item.product?.id ?? null,
            inventoryItemId: rItem.inventoryItemId,
            type: 'SALE',
            reason: 'Product sale recipe consumption',
            quantity: (-(totalDeduction) as unknown) as any, // negative for outflow
            unit: inv.unit as any,
            previousStock: (prevStock as unknown) as any,
            currentStock: (updated.currentStock as unknown) as any,
            referenceId: orderId,
            referenceType: 'ORDER',
            createdBy: userId,
          },
        });
      }
    }
  }
}
