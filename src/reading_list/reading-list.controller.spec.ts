import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListService } from './services/reading-list.service';
import { CacheService } from './services/persistence/cache/cache.service';
import { LocalFileService } from './services/persistence/local-file/local-file.service';
import { Logger } from '@nestjs/common';
import { ReadingListItem } from './dto/reading_list_item';
import { ReadingListController } from './reading-list.controller';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
import { LocalFileMock } from './services/persistence/local-file/local-file.mock';

describe('ReadingListController', () => {
  let service: ReadingListController;
  let bufferService: ProtocolBufferService;
  const ID = '1';
  const TXT = 'last-test';
  const IS_DONE = false;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingListController,
        ReadingListService,
        ProtocolBufferService,
        {
          provide: LocalFileService,
          useClass: LocalFileMock,
        },
        CacheService,
        Logger,
      ],
    }).compile();

    service = module.get<ReadingListController>(ReadingListController);
    bufferService = module.get<ProtocolBufferService>(ProtocolBufferService);
  });

  it('test Buffer.', async () => {
    service.isProtocolBuffer = false;
    const t = await service.getAllReadingListItems();
    const actual = await service.createReadingListItem(
      new ReadingListItem(ID, TXT, IS_DONE),
    );

    const encoded: Uint8Array = await bufferService.encode(actual);
    service.isProtocolBuffer = true;

    try {
      const actual2 = await service.createReadingListItem(encoded);
      console.log('actual2' + actual2);
      expect(true).toBeFalsy(); //Should not be reached
    } catch (e) {
      console.log('e' + e);
      expect(e.message).toEqual('The reading list item was already created.');
      expect(e.name).toEqual('ExistingItemException');
    }
  });
});
