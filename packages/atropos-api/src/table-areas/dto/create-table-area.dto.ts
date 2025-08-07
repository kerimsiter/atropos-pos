// packages/atropos-api/src/table-areas/dto/create-table-area.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTableAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Örn: "Bahçe"
}

