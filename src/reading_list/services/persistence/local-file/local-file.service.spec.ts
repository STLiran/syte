import { Test, TestingModule } from '@nestjs/testing';
import { LocalFileService } from './local-file.service';
import { Logger } from '@nestjs/common';
import { ReadingListItem } from '../../../dto/reading_list_item';
import { CacheService } from '../cache/cache.service';
import { Guid } from 'guid-typescript';

describe('LocalFileService', () => {
  let service: LocalFileService;
  let readingListCacheDbService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalFileService, CacheService, Logger],
    }).compile();

    service = module.get<LocalFileService>(LocalFileService);

    readingListCacheDbService = module.get<CacheService>(CacheService);
  });

  it('No Reading_list_item should be returned, Upon un-existing list item', async () => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      const item: ReadingListItem = new ReadingListItem(
        Guid.create().toString(),
        'TxtTest',
        false,
      );
      arr.push(item);
    }
    const result: ReadingListItem[] = await service.persist(arr);
    // let res2: ReadingListItem[] = [];

    //TODO SLEEP

    const res2: ReadingListItem[] = await service.load();
    // await service.load();
    // expect(result).toBe(res2);
    // service.load().then(async (result2) => {
    // res2 = await readingListCacheDbService.getAllReadingListItems();
    //   console.log('Finished2 ' + res2);
    expect(result).toBe(res2);
    // });
    // const res2: ReadingListItem[] = readingListCacheDbService.getAllReadingListItems();
    // expect(res).toBe(res2);
  });
  //
  // it('One Reading_list_item should be returned, After saving list item', () => {
  //   const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
  //   const item: ReadingListItem = service.saveReadingListItem(p);
  //   expect(item.id).toBe(ID);
  //
  //   const items: ReadingListItem[] = service.getAllReadingListItems();
  //   expect(items.length).toBe(1);
  // });
  //
  // it('Saving twice results at Exception being thrown', () => {
  //   const p1 = new ReadingListItem(ID, TXT, IS_DONE);
  //   const item: ReadingListItem = service.saveReadingListItem(p1);
  //   expect(item.id).toBe(ID);
  //
  //   expect(() => service.saveReadingListItem(p1)).toThrow(
  //     ExistingItemException,
  //   );
  // });
  //
  // it('Get unexciting reading_list', () => {
  //   expect(() => service.getReadingListItem(ID)).toThrow(BadRequestException);
  // });
  //
  // it('Delete unexciting reading_list', () => {
  //   expect(() => service.deleteReadingListItem(ID)).toThrow(
  //     BadRequestException,
  //   );
  // });
  //
  // it('update Flow - non exist', () => {
  //   service.saveReadingListItem(new ReadingListItem(ID, TXT, IS_DONE));
  //
  //   expect(() =>
  //     service.updateReadingListItem(new ReadingListItem(ID2, TXT, IS_DONE)),
  //   ).toThrow(BadRequestException);
  // });
  //
  // it('update Flow', () => {
  //   const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
  //   const p2: ReadingListItem = new ReadingListItem(ID, LAST2, IS_DONE);
  //   service.saveReadingListItem(p);
  //
  //   const updatedItem: ReadingListItem = service.updateReadingListItem(p2);
  //   expect(updatedItem.id).toBe(ID);
  // });
  //
  // it('patch Flow', () => {
  //   const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
  //   service.saveReadingListItem(p);
  //
  //   const updatedItem: ReadingListItem = service.patchReadingListItem(
  //     ID,
  //     IS_DONE,
  //   );
  //   expect(updatedItem.id).toBe(ID);
  // });
  //
  // it('Non existing item patch Flow', () => {
  //   expect(() => service.patchReadingListItem(ID, IS_DONE)).toThrow(
  //     BadRequestException,
  //   );
  // });
  //
  // it('Full Flow', () => {
  //   const noItems: ReadingListItem[] = service.getAllReadingListItems();
  //   expect(noItems.length).toBe(0);
  //
  //   const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
  //   const item: ReadingListItem = service.saveReadingListItem(p);
  //   expect(item.id).toBe(ID);
  //
  //   const items: ReadingListItem[] = service.getAllReadingListItems();
  //   expect(items.length).toBe(1);
  //   expect(items[0].id).toBe(ID);
  //
  //   const item2: ReadingListItem = service.getReadingListItem(ID);
  //   expect(item2.id).toBe(ID);
  //
  //   const item3: ReadingListItem = service.deleteReadingListItem(ID);
  //   expect(item3.id).toBe(ID);
  //
  //   const noItems2: ReadingListItem[] = service.getAllReadingListItems();
  //   expect(noItems2.length).toBe(0);
  // });
});
