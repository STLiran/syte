import { Injectable, Logger } from '@nestjs/common';
import { ReadingListInterface } from './reading-list.interface';
import { CacheService } from './persistence/cache/cache.service';
import { ReadingListItem } from '../dto/reading_list_item';
import { LocalFileService } from './persistence/local-file/local-file.service';

@Injectable()
export class ReadingListService implements ReadingListInterface {
  constructor(
    private readonly cacheService: CacheService,
    private readonly localFileService: LocalFileService,
    private readonly logger: Logger,
  ) {
    this.init().then((items: ReadingListItem[]) =>
      this.logger.log(
        `ReadingListService Finished loading ${items?.length} items.`,
      ),
    );
  }

  async init(): Promise<ReadingListItem[]> {
    const items: ReadingListItem[] = await this.localFileService.load();
    if (items) {
      for (const readingListItem of items) {
        this.logger.log(`Loaded ${readingListItem.id}`);
        await this.cacheService.saveReadingListItem(readingListItem);
      }
    }

    return items;
  }

  async persistReadingList(): Promise<void> {
    this.logger.log('Persisting');
    const items: ReadingListItem[] = await this.getAllReadingListItems();
    await this.localFileService.persist(items);
    this.logger.log('Persisting finished');
  }

  async createReadingListItem(item: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('Creating reading_list item');
    const res: ReadingListItem = await this.cacheService.saveReadingListItem(
      item,
    );
    if (res) {
      await this.localFileService.addToTxt([item]);
    }

    return item;
  }

  async getAllReadingListItems(): Promise<ReadingListItem[]> {
    this.logger.log('get all reading list items');
    return this.cacheService.getAllReadingListItems();
  }

  async getReadingListItem(id: string): Promise<ReadingListItem> {
    this.logger.log('get reading list item');
    return this.cacheService.getReadingListItem(id);
  }

  async patchReadingListItem(
    id: string,
    isDone: boolean,
  ): Promise<ReadingListItem> {
    this.logger.log('patch reading_list');
    const item: ReadingListItem = this.cacheService.patchReadingListItem(
      id,
      isDone,
    );
    await this.persistReadingList();
    return item;
  }

  async updateReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('update reading_list');

    const item: ReadingListItem = this.cacheService.updateReadingListItem(p);
    await this.persistReadingList();

    return item;
  }

  async deleteReadingListItem(id: string): Promise<ReadingListItem> {
    this.logger.log('delete reading_list');

    const item: ReadingListItem = this.cacheService.deleteReadingListItem(id);
    await this.persistReadingList();

    return item;
  }
}
