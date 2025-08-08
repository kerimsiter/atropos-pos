import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

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
}
