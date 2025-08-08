import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRecipeDto) {
    return this.prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          // connect required product relation
          product: { connect: { id: dto.productId } },
          name: dto.name,
          yield: (dto.yield ?? null) as any,
        },
      });

      if (dto.items?.length) {
        await tx.recipeItem.createMany({
          data: dto.items.map((it) => ({
            recipeId: recipe.id,
            inventoryItemId: it.inventoryItemId,
            quantity: (it.quantity as any),
            unit: it.unit,
          })),
        });
      }

      // Return with relations using the same transactional client to avoid uncommitted read issues
      const data = await tx.recipe.findFirst({
        where: { id: recipe.id, deletedAt: null },
        include: {
          items: {
            include: {
              inventoryItem: { select: { id: true, name: true, unit: true } },
            },
          },
          product: { select: { id: true, name: true, code: true } },
        },
      });
      if (!data) throw new NotFoundException('Reçete bulunamadı');
      return data;
    });
  }

  async findOne(id: string) {
    const data = await this.prisma.recipe.findFirst({
      where: { id, deletedAt: null },
      include: {
        items: {
          include: {
            inventoryItem: { select: { id: true, name: true, unit: true } },
          },
        },
        product: { select: { id: true, name: true, code: true } },
      },
    });
    if (!data) throw new NotFoundException('Reçete bulunamadı');
    return data;
  }

  async findByProduct(productId: string) {
    const recipe = await this.prisma.recipe.findFirst({
      where: { deletedAt: null, product: { id: productId } },
      include: {
        items: {
          include: {
            inventoryItem: { select: { id: true, name: true, unit: true } },
          },
        },
      },
    });
    return recipe;
  }

  async update(id: string, dto: UpdateRecipeDto) {
    return this.prisma.$transaction(async (tx) => {
      const exists = await tx.recipe.findFirst({ where: { id, deletedAt: null } });
      if (!exists) throw new NotFoundException('Reçete bulunamadı');

      await tx.recipe.update({
        where: { id },
        data: {
          name: dto.name ?? undefined,
          yield: (dto.yield as any) ?? undefined,
        },
      });

      // Remove old items, then insert new ones
      await tx.recipeItem.deleteMany({ where: { recipeId: id } });
      if (dto.items?.length) {
        await tx.recipeItem.createMany({
          data: dto.items.map((it) => ({
            recipeId: id,
            inventoryItemId: it.inventoryItemId,
            quantity: (it.quantity as any),
            unit: it.unit,
          })),
        });
      }

      // Return updated entity using transactional client
      const data = await tx.recipe.findFirst({
        where: { id, deletedAt: null },
        include: {
          items: {
            include: {
              inventoryItem: { select: { id: true, name: true, unit: true } },
            },
          },
          product: { select: { id: true, name: true, code: true } },
        },
      });
      if (!data) throw new NotFoundException('Reçete bulunamadı');
      return data;
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.recipe.findFirst({ where: { id, deletedAt: null } });
    if (!exists) throw new NotFoundException('Reçete bulunamadı');
    return this.prisma.recipe.update({ where: { id }, data: { deletedAt: new Date(), active: false } });
  }
}
