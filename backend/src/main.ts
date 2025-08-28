import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS'u etkinleştirin. Bu, diğer kaynaklardan gelen isteklere izin verir.
  // Geliştirme aşamasında bu şekilde bırakmak genellikle yeterlidir.
  // Prodüksiyonda belirli origin'lere izin vermek daha güvenlidir.
  // Örn: app.enableCors({ origin: 'http://allowed-domain.com' });
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
