import { ProductUnit } from '@prisma/client';

export class CreateInventoryItemDto {
  name!: string;
  code!: string;
  unit!: ProductUnit;
  currentStock!: number; // Decimal(10,3)
  criticalLevel?: number | null; // Decimal(10,3)
}
