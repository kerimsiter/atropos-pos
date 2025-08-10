import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoyaltyService {
  constructor(private prisma: PrismaService) {}

  async createCard(customerId: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new BadRequestException('Müşteri bulunamadı');

    const existing = await this.prisma.loyaltyCard.findUnique({ where: { customerId } });
    if (existing) return existing;

    // Simple card number generation (could be improved)
    const cardNumber = `LC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return this.prisma.loyaltyCard.create({
      data: {
        customerId,
        cardNumber,
        cardType: 'STANDARD',
      },
    });
  }

  async getCustomerLoyalty(customerId: string) {
    const card = await this.prisma.loyaltyCard.findUnique({
      where: { customerId },
      include: { transactions: { orderBy: { createdAt: 'desc' } } },
    });
    return card || null;
  }

  // Award points for a purchase within a transaction
  async earnOnPurchase(tx: Prisma.TransactionClient, orderId: string, amount: any, createdBy?: string) {
    const order = await tx.order.findUnique({ where: { id: orderId } });
    if (!order || !order.customerId) return; // no customer attached

    const card = await tx.loyaltyCard.findUnique({ where: { customerId: order.customerId } });
    if (!card) return; // require explicit card creation

    const earned = Math.floor(Number(amount)); // 1 TL = 1 puan
    if (earned <= 0) return;

    const updated = await tx.loyaltyCard.update({
      where: { id: card.id },
      data: {
        points: { increment: earned },
        totalEarnedPoints: { increment: earned },
        lastUsedAt: new Date(),
      },
    });

    await tx.loyaltyTransaction.create({
      data: {
        cardId: card.id,
        orderId: order.id,
        type: 'EARN_PURCHASE',
        points: earned,
        pointBalance: updated.points,
        amount: amount as any,
        moneyBalance: updated.balance,
        baseAmount: amount as any,
        multiplier: 1 as any,
        description: 'Alışverişten kazanım',
        createdBy,
      },
    });
  }
}
