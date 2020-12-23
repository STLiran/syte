import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListService } from './reading-list.service';
import { ReadingListCacheDbService } from './db/reading-list-cache-db.service';
import { ReadingListMongoDbService } from './db/reading-list-mongo-db.service';
import { Logger } from '@nestjs/common';
import { ReadingListItem } from './reading_list_item';
import { ReadingListController } from './reading-list.controller';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';

describe('ReadingListController', () => {
  let service: ReadingListController;
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
          provide: ReadingListMongoDbService,
          useClass: ReadingListCacheDbService,
        },
        ReadingListCacheDbService,
        Logger,
      ],
    }).compile();

    service = module.get<ReadingListController>(ReadingListController);
  });

  it('test heartBeat.', async () => {
    expect(
      await service.createReadingListItem(
        new ReadingListItem('IDm', 'txt', false),
      ),
    ).toBe('heartBeat');
  });

  it('test createReadingListItem.', async () => {
    const actual = await service.createReadingListItem(
      new ReadingListItem(ID, TXT, IS_DONE),
    );
    expect(actual.id).toEqual(ID);
  });

  it('test patchReadingListItem.', async () => {
    try {
      await service.patchReadingListItem(ID, { isDone: IS_DONE });
      expect(0).toBe(1);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });

  it('test deleteReadingListItem.', async () => {
    try {
      await service.deleteReadingListItem(ID);
      expect(0).toBe(1);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });

  it('No reading_list should returned Upon no existing items.', async () => {
    expect((await service.getAllReadingListItems()).length).toBe(0);
  });

  it('No reading_list should returned Upon un valid id.', async () => {
    try {
      await service.getReadingListItem(ID);
      expect(0).toBe(1);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });

  it('Update new reading list  item results at exception', async () => {
    try {
      await service.updateReadingListItem(
        new ReadingListItem(ID, TXT, IS_DONE),
      );
      expect(0).toBe(1);
    } catch (e) {
      expect(e.status).toBe(400);
    }
  });
});
