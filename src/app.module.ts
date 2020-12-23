import { Module } from '@nestjs/common';
import { ReadingListModule } from './reading_list/reading-list.module';

@Module({
  imports: [ReadingListModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
