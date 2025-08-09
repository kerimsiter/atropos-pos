import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EventsGateway } from '../events/events.gateway';
import { InventoryItemsService } from '../inventory-items/inventory-items.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
    private inventoryService: InventoryItemsService,
  ) {}

  async create(dto: CreatePaymentDto, userId: string, branchId: string) {
    const { orderId, paymentMethodId, amount } = dto;

    const result = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new BadRequestException('Sipariş bulunamadı');

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
