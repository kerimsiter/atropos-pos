import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  // Decimal as string to avoid JS float issues
  @IsNumberString()
  amount: string;

  // Optional: loyalty points to spend (integer as string)
  @IsOptional()
  @IsNumberString()
  pointsToSpend?: string;
}
