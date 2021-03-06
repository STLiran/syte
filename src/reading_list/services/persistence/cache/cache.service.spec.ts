import { CacheService } from './cache.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ReadingListItem } from '../../../dto/reading_list_item';
import { BadRequestException, Logger } from '@nestjs/common';

describe('CacheService', () => {
  let service: CacheService;
  const ID = 'test-id-1';
  const TXT = 'last-test';
  const IS_DONE = false;

  const ID2 = 'test-id-2';
  const LAST2 = 'last-test-2';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService, Logger],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  it('No Reading_list_item should be returned, Upon un-existing list item', () => {
    const listItems: ReadingListItem[] = service.getAllReadingListItems();
    expect(listItems.length).toBe(0);
  });

  it('One Reading_list_item should be returned, After saving list item', async () => {
    const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
    const item: ReadingListItem = await service.saveReadingListItem(p);
    expect(item.id).toBe(ID);

    const items: ReadingListItem[] = service.getAllReadingListItems();
    expect(items.length).toBe(1);
  });

  it('Saving twice results at Exception being thrown', async () => {
    const p1 = new ReadingListItem(ID, TXT, IS_DONE);
    const item: ReadingListItem = await service.saveReadingListItem(p1);
    expect(item.id).toBe(ID);

    const duplicate = await service.saveReadingListItem(p1);
    expect(duplicate).toEqual(item);
  });

  it('Get unexciting reading_list', () => {
    expect(() => service.getReadingListItem(ID)).toThrow(BadRequestException);
  });

  it('Delete unexciting reading_list', () => {
    expect(() => service.deleteReadingListItem(ID)).toThrow(
      BadRequestException,
    );
  });

  it('update Flow - non exist', () => {
    service.saveReadingListItem(new ReadingListItem(ID, TXT, IS_DONE));

    expect(() =>
      service.updateReadingListItem(new ReadingListItem(ID2, TXT, IS_DONE)),
    ).toThrow(BadRequestException);
  });

  it('update Flow', () => {
    const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
    const p2: ReadingListItem = new ReadingListItem(ID, LAST2, IS_DONE);
    service.saveReadingListItem(p);

    const updatedItem: ReadingListItem = service.updateReadingListItem(p2);
    expect(updatedItem.id).toBe(ID);
  });

  it('patch Flow', () => {
    const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
    service.saveReadingListItem(p);

    const updatedItem: ReadingListItem = service.patchReadingListItem(
      ID,
      IS_DONE,
    );
    expect(updatedItem.id).toBe(ID);
  });

  it('Non existing item patch Flow', () => {
    expect(() => service.patchReadingListItem(ID, IS_DONE)).toThrow(
      BadRequestException,
    );
  });

  it('Full Flow', async () => {
    const noItems: ReadingListItem[] = service.getAllReadingListItems();
    expect(noItems.length).toBe(0);

    const p: ReadingListItem = new ReadingListItem(ID, TXT, IS_DONE);
    const item: ReadingListItem = await service.saveReadingListItem(p);
    expect(item.id).toBe(ID);

    const items: ReadingListItem[] = service.getAllReadingListItems();
    expect(items.length).toBe(1);
    expect(items[0].id).toBe(ID);

    const item2: ReadingListItem = service.getReadingListItem(ID);
    expect(item2.id).toBe(ID);

    const item3: ReadingListItem = service.deleteReadingListItem(ID);
    expect(item3.id).toBe(ID);

    const noItems2: ReadingListItem[] = service.getAllReadingListItems();
    expect(noItems2.length).toBe(0);
  });
});
