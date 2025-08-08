import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { TaxesModule } from './taxes/taxes.module';
import { TableAreasModule } from './table-areas/table-areas.module';
import { BranchesModule } from './branches/branches.module';
import { UsersModule } from './users/users.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { PaymentsModule } from './payments/payments.module';
// import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    TaxesModule,
    TableAreasModule,
    BranchesModule,
    UsersModule,
    TablesModule,
    OrdersModule,
    PaymentMethodsModule,
    PaymentsModule,
    // OrderItemsModule, // disabled in favor of nested routes in OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
