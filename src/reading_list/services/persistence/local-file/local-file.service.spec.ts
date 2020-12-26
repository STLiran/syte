import { Test, TestingModule } from '@nestjs/testing';
import { LocalFileService } from './local-file.service';
import { Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { ReadingListItem } from '../../../dto/reading_list_item';

describe('LocalFileService', () => {
  const TEST_PATH = 'src/reading_list/resources/todo_list_test.txt';

  const ID = 'id-1';
  const TXT = 'last-test';
  const IS_DONE = false;

  let service: LocalFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalFileService, CacheService, Logger],
    }).compile();

    service = module.get<LocalFileService>(LocalFileService);
    service.PATH = TEST_PATH;
  });

  afterEach(async () => {
    const readingListItems: boolean = await service.delete();
    expect(readingListItems).toBeTruthy();
  });

  it('Test load', async () => {
    const loaded = await service.load();
    expect(loaded).toEqual([]);
  });

  it('Test addToTxt', async () => {
    const item = new ReadingListItem(ID, TXT, IS_DONE);
    const readingListItems = await service.addToTxt([item]);
    expect(readingListItems).toEqual([item]);
  });

  it('Test persist', async () => {
    const item = new ReadingListItem(ID, TXT, IS_DONE);

    const readingListItems = await service.persist([item]);
    expect(readingListItems).toEqual([item]);
  });
});
