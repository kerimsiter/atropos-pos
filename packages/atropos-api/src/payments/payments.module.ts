import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsGateway } from '../events/events.gateway';
import { InventoryItemsModule } from '../inventory-items/inventory-items.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [PrismaModule, InventoryItemsModule, LoyaltyModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, EventsGateway],
})
export class PaymentsModule {}
