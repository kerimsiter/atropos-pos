import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // YENİ: ValidationPipe import edildi

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // YENİ: Global Validation Pipe eklendi
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da olmayan verileri otomatik olarak kaldırır
      forbidNonWhitelisted: true, // DTO'da olmayan bir veri gelirse hata fırlatır
      transform: true, // Gelen veriyi DTO tipine dönüştürmeye çalışır
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
