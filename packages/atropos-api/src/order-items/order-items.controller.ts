import { Body, Controller, Delete, Param, Patch, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderItemsService } from './order-items.service';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Patch(':id')
  async updateQuantity(@Param('id') id: string, @Body(new ValidationPipe()) body: UpdateOrderItemDto) {
    return this.orderItemsService.updateQuantity(id, body.quantity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderItemsService.removeItem(id);
  }
}
