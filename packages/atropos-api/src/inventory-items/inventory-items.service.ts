import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

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
}
