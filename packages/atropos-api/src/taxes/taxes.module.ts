import { Module } from '@nestjs/common';
import { TaxesController } from './taxes.controller';
import { TaxesService } from './taxes.service';
import { PrismaModule } from '../prisma/prisma.module'; // PrismaModule'ü import et

@Module({
  imports: [PrismaModule], // PrismaModule'ü buraya ekle
  controllers: [TaxesController],
  providers: [TaxesService],
})
export class TaxesModule {}
