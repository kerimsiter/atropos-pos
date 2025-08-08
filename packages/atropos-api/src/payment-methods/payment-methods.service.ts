import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  findAllByCompany(companyId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { companyId, active: true },
      orderBy: { displayOrder: 'asc' },
    });
  }
}
