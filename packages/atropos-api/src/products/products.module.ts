import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule'ü import et

@Module({
  imports: [PrismaModule], // PrismaModule'ü buraya ekle
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
