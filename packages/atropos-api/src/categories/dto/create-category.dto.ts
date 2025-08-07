// packages/atropos-api/src/categories/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional() // Üst kategori olmak zorunda değil
  parentId?: string;
}

