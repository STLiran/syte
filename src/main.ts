import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ReadingListService } from './reading_list/services/reading-list.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.get(ReadingListService).subscribeToShutdown(() => app.close());

  await app.listen(5060);
}
bootstrap().then(() => console.log('Bootstrap finished'));
