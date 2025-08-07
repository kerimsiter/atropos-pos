// packages/atropos-api/src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto'; // Ekle

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

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
