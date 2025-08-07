import { Controller, Post, Body, UseGuards, Request, ValidationPipe, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body(new ValidationPipe({ transform: true })) createOrderDto: CreateOrderDto, @Request() req) {
    const { userId, branchId } = req.user;
    return this.ordersService.create(createOrderDto, userId, branchId);
  }

  @Get('active-by-table/:tableId')
  findActiveByTable(@Param('tableId') tableId: string, @Request() req) {
    const { branchId } = req.user;
    return this.ordersService.findActiveByTable(tableId, branchId);
  }
}
