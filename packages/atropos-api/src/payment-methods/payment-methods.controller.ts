import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentMethodsService } from './payment-methods.service';

@UseGuards(AuthGuard('jwt'))
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  findAll(@Request() req) {
    const { companyId } = req.user;
    return this.paymentMethodsService.findAllByCompany(companyId);
    
  }
}
