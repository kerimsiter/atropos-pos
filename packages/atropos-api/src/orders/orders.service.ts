import { Injectable } from '@nestjs/common';
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
}
