// packages/atropos-api/src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto, companyId: string) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        companyId,
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.category.findMany({
      where: { companyId },
      // Varsa üst kategorinin adını da getirelim
      include: { parent: true },
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}

