// packages/atropos-api/src/taxes/taxes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxDto } from './dto/create-tax.dto';

@Injectable()
export class TaxesService {
  constructor(private prisma: PrismaService) {}

  create(createTaxDto: CreateTaxDto, companyId: string) {
    return this.prisma.tax.create({
      data: { ...createTaxDto, companyId },
    });
  }

  findAll(companyId: string) {
    return this.prisma.tax.findMany({ where: { companyId } });
  }

  remove(id: string) {
    return this.prisma.tax.delete({ where: { id } });
  }
}
