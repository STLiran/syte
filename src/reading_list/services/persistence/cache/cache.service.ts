import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReadingListItem } from '../../../dto/reading_list_item';
import { CacheInterface } from './cache-interface';
import { ExistingItemException } from '../../../exceptions/existing-item-exception';

@Injectable()
export class CacheService implements CacheInterface {
  private map: Map<string, ReadingListItem> = new Map();

  constructor(private logger: Logger) {}

  saveReadingListItem(item: ReadingListItem): ReadingListItem {
    if (!this.map.has(item.id)) {
      this.logger.log(`The item id ${item.id} was saved to the cache.`);
      this.map.set(item.id, item);
      return item;
    } else {
      this.logger.warn('The reading list item was already created.');
      return item;
    }
  }

  getAllReadingListItems(): ReadingListItem[] {
    const list: ReadingListItem[] = [];
    for (const value of this.map.values()) {
      list.push(value);
    }
    return list;
  }

  getReadingListItem(id: string): ReadingListItem {
    if (this.map.has(id)) {
      return this.map.get(id);
    } else {
      throw new BadRequestException('The reading list item doesnt exist.');
    }
  }

  patchReadingListItem(id: string, isDone: boolean): ReadingListItem {
    if (!this.map.has(id)) {
      throw new BadRequestException('The reading list item doesnt exist.');
    }
    const r: ReadingListItem = this.map.get(id);
    r.isDone = isDone;
    return this.updateReadingListItem(r);
  }

  updateReadingListItem(r: ReadingListItem): ReadingListItem {
    if (!this.map.has(r.id)) {
      throw new BadRequestException('The reading list item doesnt exist.');
    }
    this.map.set(r.id, r);
    return r;
  }

  deleteReadingListItem(id: string): ReadingListItem {
    if (!this.map.has(id)) {
      throw new BadRequestException('The reading list item doesnt exist.');
    }
    const p: ReadingListItem = this.map.get(id);
    this.map.delete(id);
    return p;
  }
}
