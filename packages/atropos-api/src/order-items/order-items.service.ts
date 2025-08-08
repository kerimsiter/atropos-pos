import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderItemsService {
  constructor(private prisma: PrismaService) {}

  private toDecimal(n: number | string) {
    return new Prisma.Decimal(n as any);
  }

  private calcItemTotals(unitPrice: Prisma.Decimal, quantity: Prisma.Decimal, discountAmount: Prisma.Decimal, discountRate: Prisma.Decimal, taxRate: Prisma.Decimal) {
    const hundred = new Prisma.Decimal(100);
    const lineBase = unitPrice.mul(quantity);
    let afterDiscount = lineBase;

    if (discountAmount.gt(0)) {
      afterDiscount = afterDiscount.sub(discountAmount);
    }
    if (discountRate.gt(0)) {
      afterDiscount = afterDiscount.sub(afterDiscount.mul(discountRate).div(hundred));
    }
    if (afterDiscount.lt(0)) afterDiscount = new Prisma.Decimal(0);

    const taxAmount = afterDiscount.mul(taxRate).div(hundred);
    const totalAmount = afterDiscount.add(taxAmount);

    return { subtotal: afterDiscount, taxAmount, totalAmount };
  }

  private async recomputeOrderTotals(tx: Prisma.TransactionClient, orderId: string) {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const items = await tx.orderItem.findMany({ where: { orderId } });
    const hundred = new Prisma.Decimal(100);

    let itemsSubtotal = new Prisma.Decimal(0);
    let itemsTax = new Prisma.Decimal(0);
    let itemsTotal = new Prisma.Decimal(0);

    for (const it of items) {
      const { subtotal, taxAmount, totalAmount } = this.calcItemTotals(
        it.unitPrice as any,
        it.quantity as any,
        it.discountAmount as any,
        it.discountRate as any,
        it.taxRate as any,
      );
      itemsSubtotal = itemsSubtotal.add(subtotal);
      itemsTax = itemsTax.add(taxAmount);
      itemsTotal = itemsTotal.add(totalAmount);
    }

    // Apply order-level discount on subtotal
    let orderSubtotal = itemsSubtotal;
    if ((order.discountAmount as any) && (order.discountAmount as any).gt?.(0)) {
      orderSubtotal = orderSubtotal.sub(order.discountAmount as any);
    }
    if ((order.discountRate as any) && (order.discountRate as any).gt?.(0)) {
      orderSubtotal = orderSubtotal.sub(orderSubtotal.mul(order.discountRate as any).div(hundred));
    }
    if ((orderSubtotal as any).lt?.(0)) orderSubtotal = new Prisma.Decimal(0);

    // taxAmount: sum of item taxes (already after item discounts). You may add order-level tax adjustments if needed.
    const taxAmount = itemsTax;

    const serviceCharge = order.serviceCharge as any as Prisma.Decimal;
    const deliveryFee = order.deliveryFee as any as Prisma.Decimal;
    const tipAmount = order.tipAmount as any as Prisma.Decimal;
    const roundingAmount = order.roundingAmount as any as Prisma.Decimal;

    const totalAmount = orderSubtotal
      .add(taxAmount)
      .add(serviceCharge)
      .add(deliveryFee)
      .add(tipAmount)
      .add(roundingAmount);

    await tx.order.update({
      where: { id: orderId },
      data: {
        subtotal: orderSubtotal,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
      },
    });
  }

  async updateQuantity(orderItemId: string, quantity: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({ where: { id: orderItemId } });
      if (!item) throw new NotFoundException('Order item not found');

      if (quantity <= 0) {
        await tx.orderItem.delete({ where: { id: orderItemId } });
        await this.recomputeOrderTotals(tx, item.orderId);
        return { ok: true };
      }

      const q = this.toDecimal(quantity);
      const updatedItemTotals = this.calcItemTotals(
        item.unitPrice as any,
        q as any,
        item.discountAmount as any,
        item.discountRate as any,
        item.taxRate as any,
      );

      await tx.orderItem.update({
        where: { id: orderItemId },
        data: {
          quantity: q,
          taxAmount: updatedItemTotals.taxAmount,
          totalAmount: updatedItemTotals.totalAmount,
        },
      });

      await this.recomputeOrderTotals(tx, item.orderId);
      return { ok: true };
    });
  }

  async removeItem(orderItemId: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({ where: { id: orderItemId } });
      if (!item) throw new NotFoundException('Order item not found');

      await tx.orderItem.delete({ where: { id: orderItemId } });
      await this.recomputeOrderTotals(tx, item.orderId);
      return { ok: true };
    });
  }
}
