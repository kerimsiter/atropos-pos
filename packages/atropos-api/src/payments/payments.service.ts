import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EventsGateway } from '../events/events.gateway';
import { InventoryItemsService } from '../inventory-items/inventory-items.service';
import { LoyaltyService } from '../loyalty/loyalty.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private inventoryService: InventoryItemsService,
    private loyaltyService: LoyaltyService,
  ) {}

  async create(dto: CreatePaymentDto, userId: string, branchId: string) {
    const { orderId, paymentMethodId, amount } = dto;
    const pointsToSpendRaw = dto.pointsToSpend ? Number(dto.pointsToSpend) : 0;
    const POINTS_PER_TL = 10; // 10 puan = 1 TL

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new BadRequestException('Sipariş bulunamadı');

      // If requested, spend loyalty points as discount before recording payment
      let discountMoney = 0;
      if (pointsToSpendRaw && pointsToSpendRaw > 0) {
        if (!order.customerId) {
          throw new BadRequestException('Bu siparişe müşteri atanmadığı için puan kullanılamaz');
        }
        const card = await tx.loyaltyCard.findUnique({ where: { customerId: order.customerId } });
        if (!card) {
          throw new BadRequestException('Müşterinin sadakat kartı bulunamadı');
        }
        const pts = Math.floor(pointsToSpendRaw);
        if (pts <= 0) {
          throw new BadRequestException('Geçersiz puan değeri');
        }
        if (Number(card.points) < pts) {
          throw new BadRequestException('Yetersiz puan');
        }
        // Convert points to TL (floor to 2 decimals)
        discountMoney = Math.floor((pts / POINTS_PER_TL) * 100) / 100;
        if (discountMoney <= 0) {
          throw new BadRequestException('Puan indirime dönüşmedi');
        }
        // Apply discount to order
        await tx.order.update({
          where: { id: order.id },
          data: { discountAmount: { increment: discountMoney as any } },
        });
        // Deduct points and log transaction
        const updatedCard = await tx.loyaltyCard.update({
          where: { id: card.id },
          data: {
            points: { decrement: pts },
            lastUsedAt: new Date(),
          },
        });
        await tx.loyaltyTransaction.create({
          data: {
            cardId: card.id,
            orderId: order.id,
            type: 'SPEND_DISCOUNT',
            points: -pts as any,
            pointBalance: updatedCard.points,
            amount: (-discountMoney) as any,
            moneyBalance: updatedCard.balance,
            baseAmount: (discountMoney) as any,
            multiplier: 1 as any,
            description: 'Puan harcama (indirim)',
            createdBy: userId,
          },
        });
      }

      // Create cash movement first to get id
      const previousBalance = 0; // TODO: read from cash register balance if exists
      const cm = await tx.cashMovement.create({
        data: {
          branchId: branchId || order.branchId,
          userId,
          type: 'SALE',
          paymentMethodId,
          amount,
          description: `Order ${order.orderNumber} payment`,
          referenceId: order.id,
          referenceType: 'ORDER',
          previousBalance,
          currentBalance: (Number(previousBalance) + Number(amount)).toFixed(2),
        },
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethodId,
          amount,
          status: 'PAID',
          cashMovementId: cm.id,
        },
      });

      // Update order paid and status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          paidAmount: { increment: amount as unknown as any },
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        include: { table: true },
      });

      // Free the table if dine-in and table exists
      if (updatedOrder.tableId) {
        await tx.table.update({
          where: { id: updatedOrder.tableId },
          data: { status: 'EMPTY' },
        });
      }

      // Deduct stock according to recipes for ordered products
      await this.inventoryService.deductStockForOrder(
        order.id,
        branchId || order.branchId,
        userId,
        tx,
      );

      // Loyalty earn: if order has a customer with a loyalty card, award points
      try {
        await this.loyaltyService.earnOnPurchase(tx as any, order.id, amount, userId);
      } catch (e) {
        // Do not fail payment if loyalty fails
      }

      return { payment, order: updatedOrder };
    });
    try {
      // Broadcast status update so KDS and waiter views refresh
      this.eventsGateway.emitOrderStatusUpdated(result.order);
    } catch (e) {
      // swallow WS errors
    }
    return result;
  }
}
