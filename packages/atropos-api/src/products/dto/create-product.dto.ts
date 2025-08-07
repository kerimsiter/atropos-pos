// packages/atropos-api/src/products/dto/create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string; // SKU

  @IsNumber()
  @IsPositive()
  basePrice: number;

  // Bu alanları şimdilik elle göndereceğiz
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  taxId: string;
}

