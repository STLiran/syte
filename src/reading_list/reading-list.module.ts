import { Logger, Module } from '@nestjs/common';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './reading-list.service';
import { ReadingListCacheDbService } from './db/reading-list-cache-db.service';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
import { ReadingListLocalFileService } from './db/reading-list-local-file.service';

@Module({
  imports: [],
  controllers: [ReadingListController],
  providers: [
    ReadingListCacheDbService,
    ReadingListService,
    Logger,
    ProtocolBufferService,
    ReadingListLocalFileService,
  ],
})
export class ReadingListModule {}
