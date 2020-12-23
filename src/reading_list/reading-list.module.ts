import { Logger, Module } from '@nestjs/common';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './services/reading-list.service';
import { CacheService } from './db/cache/cache.service';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
import { LocalFileService } from './db/local-file/local-file.service';

@Module({
  imports: [],
  controllers: [ReadingListController],
  providers: [
    CacheService,
    ReadingListService,
    Logger,
    ProtocolBufferService,
    LocalFileService,
  ],
})
export class ReadingListModule {}
