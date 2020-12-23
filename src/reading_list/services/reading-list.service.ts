import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ReadingListInterface } from './reading-list.interface';
import { CacheService } from '../db/cache/cache.service';
import { ReadingListItem } from '../dto/reading_list_item';
import { LocalFileService } from '../db/local-file/local-file.service';

@Injectable()
export class ReadingListService
  implements ReadingListInterface, OnApplicationShutdown {
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

  async onApplicationShutdown(signal?: string): Promise<any> {
    console.log('onApplicationShutdown');
    const items: ReadingListItem[] = await this.getAllReadingListItems();
    await this.localFileService.delete();
    await this.localFileService.save(items);
    return 1;
  }

  async init(): Promise<ReadingListItem[]> {
    const items: ReadingListItem[] = await this.localFileService.load();
    if (items) {
      for (const readingListItem of items) {
        this.logger.log(`Loaded ${readingListItem.id}`);
        this.cacheService.saveReadingListItem(readingListItem);
      }
    }
    return items;
  }

  async heartBeat(): Promise<string> {
    this.logger.log('heartBeat');
    return 'heartBeat';
  }

  async createReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('reading_list was created');
    return this.cacheService.saveReadingListItem(p);
  }

  async getAllReadingListItems(): Promise<ReadingListItem[]> {
    this.logger.log('get all reading list Items');
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
    return this.cacheService.patchReadingListItem(id, isDone);
  }

  async updateReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('update reading_list');
    return this.cacheService.updateReadingListItem(p);
  }

  async deleteReadingListItem(id: string): Promise<ReadingListItem> {
    this.logger.log('delete reading_list');
    return this.cacheService.deleteReadingListItem(id);
  }
}
