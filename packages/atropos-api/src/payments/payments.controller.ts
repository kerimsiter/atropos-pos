import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body(new ValidationPipe()) body: CreatePaymentDto, @Request() req) {
    const { userId, branchId } = req.user;
    return this.paymentsService.create(body, userId, branchId);
  }
}
