import { Module } from '@nestjs/common';
import { TableAreasController } from './table-areas.controller';
import { TableAreasService } from './table-areas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TableAreasController],
  providers: [TableAreasService]
})
export class TableAreasModule {}
