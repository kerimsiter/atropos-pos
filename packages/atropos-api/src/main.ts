import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Bu satırı ekleyin

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // Bu satırı ekleyin

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
