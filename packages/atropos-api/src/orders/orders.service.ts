import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string, branchId: string) {
    const { tableId, items } = createOrderDto;

    // Prisma Transaction: Bu blok içindeki tüm işlemler ya hep ya hiç prensibiyle çalışır.
    return this.prisma.$transaction(async (tx) => {
      // 0. Masaya ait aktif bir sipariş var mı? (Tek aktif sipariş politikası)
      const existing = await tx.order.findFirst({
        where: {
          branchId,
          tableId,
          status: { in: [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.SERVING,
          ] },
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
      });

      const incomingTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

      if (existing) {
        // MERGE (Birleştirme) Mantığı: Aynı ürün varsa miktarı artır, yoksa satır oluştur
        for (const item of items) {
          await tx.orderItem.upsert({
            where: { orderId_productId: { orderId: existing.id, productId: item.productId } },
            update: {
              quantity: { increment: item.quantity },
              totalAmount: { increment: item.unitPrice * item.quantity },
            },
            create: {
              orderId: existing.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.unitPrice * item.quantity,
              taxRate: 0,
              taxAmount: 0,
            },
          });
        }

        await tx.order.update({
          where: { id: existing.id },
          data: {
            subtotal: { increment: incomingTotal },
            totalAmount: { increment: incomingTotal },
          },
        });

        await tx.table.update({ where: { id: tableId }, data: { status: 'OCCUPIED' } });
        return existing;
      }

      // 1. Yeni sipariş oluştur
      const order = await tx.order.create({
        data: {
          branchId,
          tableId,
          waiterId: userId,
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          orderType: 'DINE_IN',
          subtotal: incomingTotal,
          taxAmount: 0, // Şimdilik vergiyi 0 kabul ediyoruz
          totalAmount: incomingTotal,
          orderNumber: `ORD-${Date.now()}`
        }
      });

      // 2. Sipariş kalemleri
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.unitPrice * item.quantity,
            taxRate: 0,
            taxAmount: 0,
          },
        });
      }

      // 3. Masa durumunu güncelle
      await tx.table.update({ where: { id: tableId }, data: { status: 'OCCUPIED' } });

      return order;
    });
  }

  async findActiveByTable(tableId: string, branchId: string) {
    return this.prisma.order.findFirst({
      where: {
        branchId,
        tableId,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVING'],
        },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  private async recomputeOrderTotals(tx: PrismaService['$transaction'] extends (cb: infer T) => any ? any : any, orderId: string) {
    // fetch items for the order
    const items = await tx.orderItem.findMany({ where: { orderId } });
    const subtotal = items.reduce((sum: number, it: any) => sum + Number(it.unitPrice) * Number(it.quantity), 0);
    const itemsTax = items.reduce((sum: number, it: any) => sum + Number(it.taxAmount ?? 0), 0);
    // Order-level fields (kept simple; extend when discount/service charge logic is finalized)
    const totalAmount = subtotal + itemsTax; 
    await tx.order.update({ where: { id: orderId }, data: { subtotal, taxAmount: itemsTax, totalAmount } });
  }

  async updateItemQuantity(orderId: string, itemId: string, quantity: number, branchId: string) {
    if (quantity <= 0) {
      return this.removeItemFromOrder(orderId, itemId, branchId);
    }
    return this.prisma.$transaction(async (tx) => {
      // authorize order belongs to branch
      const order = await tx.order.findFirst({ where: { id: orderId, branchId, deletedAt: null } });
      if (!order) {
        console.warn('[updateItemQuantity] Order not found or unauthorized', { orderId, branchId });
      }
      if (!order) throw new NotFoundException('Order not found or unauthorized');

      let item = await tx.orderItem.findFirst({ where: { id: itemId, orderId } });
      if (!item) {
        // Fallback: sometimes UI may send productId instead of orderItemId
        item = await tx.orderItem.findFirst({ where: { productId: itemId, orderId } });
      }
      if (!item) {
        const all = await tx.orderItem.findMany({ where: { orderId }, select: { id: true, productId: true, quantity: true } });
        console.warn('[updateItemQuantity] Order item not found for order', { orderId, itemId, items: all });
        throw new NotFoundException('Order item not found');
      }

      // update item totals (simple, no item-level discounts for now)
      const unitPrice = Number(item.unitPrice);
      const newTotal = unitPrice * quantity;
      await tx.orderItem.update({
        where: { id: item.id },
        data: {
          quantity,
          totalAmount: newTotal,
        },
      });

      await this.recomputeOrderTotals(tx, orderId);
      return { ok: true };
    });
  }

  async removeItemFromOrder(orderId: string, itemId: string, branchId: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({ where: { id: orderId, branchId, deletedAt: null } });
      if (!order) {
        console.warn('[removeItemFromOrder] Order not found or unauthorized', { orderId, branchId });
      }
      if (!order) throw new NotFoundException('Order not found or unauthorized');

      let item = await tx.orderItem.findFirst({ where: { id: itemId, orderId } });
      if (!item) {
        // Fallback: sometimes UI may send productId instead of orderItemId
        item = await tx.orderItem.findFirst({ where: { productId: itemId, orderId } });
      }
      if (!item) {
        const all = await tx.orderItem.findMany({ where: { orderId }, select: { id: true, productId: true, quantity: true } });
        console.warn('[removeItemFromOrder] Order item not found for order', { orderId, itemId, items: all });
        throw new NotFoundException('Order item not found');
      }

      await tx.orderItem.delete({ where: { id: item.id } });
      await this.recomputeOrderTotals(tx, orderId);
      return { ok: true };
    });
  }

  async confirm(orderId: string, branchId: string) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId, branchId, deletedAt: null } });
    if (!order) {
      console.warn('[confirm] Order not found or unauthorized', { orderId, branchId });
    }
    if (!order) throw new NotFoundException('Order not found or unauthorized');

    // Optionally, validate it has at least one item
    const itemsCount = await this.prisma.orderItem.count({ where: { orderId } });
    if (itemsCount === 0) {
      throw new NotFoundException('Order has no items to confirm');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.CONFIRMED },
      include: { items: true },
    });
    return updated;
  }
}
