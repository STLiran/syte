import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListService } from './services/reading-list.service';
import { CacheService } from './services/persistence/cache/cache.service';
import { LocalFileService } from './services/persistence/local-file/local-file.service';
import { Logger } from '@nestjs/common';
import { ReadingListItem } from './dto/reading_list_item';
import { ReadingListController } from './reading-list.controller';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
import { LocalFileMock } from './services/persistence/local-file/local-file.mock';
import { InputValidationService } from './services/input-validation/input-validation.service';

describe('ReadingListController', () => {
  let service: ReadingListController;
  let bufferService: ProtocolBufferService;
  let localFileMock: LocalFileMock;
  const ID = 'id-2';
  const TXT = 'last-test-txt';
  const TXT2 = 'last-test-txt-2';
  const IS_DONE = false;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingListController,
        ReadingListService,
        ProtocolBufferService,
        InputValidationService,
        {
          provide: LocalFileService,
          useClass: LocalFileMock,
        },
        LocalFileMock,
        CacheService,
        Logger,
      ],
    }).compile();

    service = module.get<ReadingListController>(ReadingListController);
    try {
      localFileMock = module.get<LocalFileMock>(LocalFileMock);
    } catch (e) {
      console.error('Noo,' + e, e);
    }
    bufferService = module.get<ProtocolBufferService>(ProtocolBufferService);
  });

  afterEach(async () => {
    const readingListItems: boolean = await localFileMock.delete();
    expect(readingListItems).toBeTruthy();
  });

  it('test create reading list item with buffer.', async () => {
    const actual = new ReadingListItem(ID, TXT, IS_DONE);

    const encodedData: Uint8Array = await bufferService.encode(actual);
    const encodedRequest = { type: 'Buffer', data: encodedData };

    const encoded = await service.createReadingListItem(encodedRequest);
    const decoded = await bufferService.decode(encoded);
    expect(decoded).toEqual(actual);
  });

  it('test update reading list item with buffer.', async () => {
    const actual = new ReadingListItem(ID, TXT, IS_DONE);
    const update = new ReadingListItem(ID, TXT2, IS_DONE);
    await service.createReadingListItem(actual);

    const encodedData: Uint8Array = await bufferService.encode(update);
    const encodedRequest = { type: 'Buffer', data: encodedData };

    const encoded = await service.updateReadingListItem(encodedRequest);
    const decoded = await bufferService.decode(encoded);
    expect(decoded).toEqual(update);

    const allItems = await service.getAllReadingListItems();
    expect(allItems).toEqual([update]);
  });
});
