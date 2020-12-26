import { Logger, Module } from '@nestjs/common';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './services/reading-list.service';
import { CacheService } from './services/persistence/cache/cache.service';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
import { LocalFileService } from './services/persistence/local-file/local-file.service';
import { InputValidationService } from './services/input-validation/input-validation.service';
import { LocalFileMock } from './services/persistence/local-file/local-file.mock';

@Module({
  imports: [],
  controllers: [ReadingListController],
  providers: [
    CacheService,
    ReadingListService,
    Logger,
    ProtocolBufferService,
    LocalFileMock,
    LocalFileService,
    InputValidationService,
  ],
})
export class ReadingListModule {}
