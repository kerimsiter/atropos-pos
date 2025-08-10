import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoyaltyService } from './loyalty.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class LoyaltyController {
  constructor(private loyaltyService: LoyaltyService) {}

  @Post('loyalty/cards')
  createCard(@Body(new ValidationPipe()) body: { customerId: string }) {
    return this.loyaltyService.createCard(body.customerId);
  }

  @Get('customers/:id/loyalty')
  getCustomerLoyalty(@Param('id') id: string) {
    return this.loyaltyService.getCustomerLoyalty(id);
  }
}
