// packages/atropos-api/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, companyId: string) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        companyId, // Ürünü şirkete bağla
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: { category: true, tax: true } // İlişkili verileri de getir
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
