// packages/atropos-api/src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { BadRequestException } from '@nestjs/common';

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
    // Kategoriye bağlı ürün varsa silmeye izin verme (FK hatasını kullanıcı dostu mesajla karşıla)
    return this.prisma.$transaction(async (tx) => {
      const productCount = await tx.product.count({ where: { categoryId: id } });
      if (productCount > 0) {
        throw new BadRequestException(
          'Bu kategoriye bağlı ürünler bulunduğu için kategori silinemez. Lütfen önce ürünleri başka kategoriye taşıyın veya silin.'
        );
      }
      return tx.category.delete({ where: { id } });
    });
  }
}

