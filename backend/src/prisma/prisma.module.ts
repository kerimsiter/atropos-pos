import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Modülü global yapar
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Diğer modüllerin kullanabilmesi için export et
})
export class PrismaModule {}
