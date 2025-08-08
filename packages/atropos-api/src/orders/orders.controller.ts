import { Controller, Post, Body, UseGuards, Request, ValidationPipe, Get, Param, Patch, Delete, BadRequestException } from '@nestjs/common';
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

  @Patch(':orderId/items/:itemId')
  updateItemQuantity(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
    @Request() req,
  ) {
    const { branchId } = req.user;
    console.debug('[OrdersController.updateItemQuantity] params', { orderId, itemId, quantity, branchId });
    const q = Number(quantity);
    if (!Number.isFinite(q)) {
      throw new BadRequestException('Quantity must be a number');
    }
    if (q < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }
    return this.ordersService.updateItemQuantity(orderId, itemId, q, branchId);
  }

  @Delete(':orderId/items/:itemId')
  removeItemFromOrder(
    @Param('orderId') orderId: string,
    @Param('itemId') itemId: string,
    @Request() req,
  ) {
    const { branchId } = req.user;
    console.debug('[OrdersController.removeItemFromOrder] params', { orderId, itemId, branchId });
    return this.ordersService.removeItemFromOrder(orderId, itemId, branchId);
  }

  @Patch(':orderId/confirm')
  confirm(@Param('orderId') orderId: string, @Request() req) {
    const { branchId } = req.user;
    console.debug('[OrdersController.confirm] params', { orderId, branchId });
    return this.ordersService.confirm(orderId, branchId);
  }
}
