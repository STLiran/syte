import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  await app.listen(5060);
}
bootstrap().then(() => console.log('Bootstrap finished'));
