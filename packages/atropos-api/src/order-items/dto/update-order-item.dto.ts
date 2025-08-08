import { IsNumber, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsNumber()
  @Min(0)
  quantity: number;
}
