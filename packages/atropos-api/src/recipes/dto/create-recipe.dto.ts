import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { ProductUnit } from '@prisma/client';

export class CreateRecipeItemDto {
  @IsString()
  inventoryItemId!: string;

  @IsNumber()
  quantity!: number; // Decimal(10,3)

  @IsEnum(ProductUnit)
  unit!: ProductUnit;
}

export class CreateRecipeDto {
  @IsString()
  productId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  @IsOptional()
  yield?: number; // Decimal(10,3) portions

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeItemDto)
  items!: CreateRecipeItemDto[];
}
