// packages/atropos-api/src/orders/dto/create-order.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { Transform } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => typeof value === 'string' ? Number(value) : value)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => typeof value === 'string' ? Number(value) : value)
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  tableId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

