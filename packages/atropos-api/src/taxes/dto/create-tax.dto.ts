// packages/atropos-api/src/taxes/dto/create-tax.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTaxDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Örn: "KDV %10"

  @IsString()
  @IsNotEmpty()
  code: string; // Örn: "VAT10"

  @IsNumber()
  @IsPositive()
  rate: number; // Örn: 10
}

