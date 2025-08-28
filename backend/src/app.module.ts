import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module'; // YENİ: CompanyModule import edildi

@Module({
  imports: [PrismaModule, CompanyModule], // YENİ: CompanyModule eklendi
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
