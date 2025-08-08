import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(branchId: string) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [dailyStats, openTablesCount, topSellingProducts] = await this.prisma.$transaction([
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: { id: true },
        where: {
          branchId,
          status: OrderStatus.COMPLETED,
          completedAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      }),
      this.prisma.table.count({
        where: {
          branchId,
          status: 'OCCUPIED',
        },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
          order: {
            branchId,
            status: OrderStatus.COMPLETED,
            completedAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 5,
      }),
    ]);

    const productIds = topSellingProducts.map((p: any) => p.productId).filter(Boolean);
    const products = productIds.length
      ? await this.prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true } })
      : [];

    const topProductsWithNames = topSellingProducts.map((p: any) => {
      const product = products.find((prod) => prod.id === p.productId);
      return {
        productId: p.productId,
        quantity: p._sum?.quantity || 0,
        name: product?.name || 'Bilinmeyen Ürün',
      };
    });

    return {
      todaysRevenue: Number(dailyStats._sum.totalAmount || 0),
      todaysOrders: Number(dailyStats._count.id || 0),
      openTables: openTablesCount,
      topProducts: topProductsWithNames,
    };
  }
}
