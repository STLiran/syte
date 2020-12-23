import { Injectable, Logger } from '@nestjs/common';
import { ReadingListInterfaceService } from './reading-list-interface.service';
import { ReadingListCacheDbService } from './db/reading-list-cache-db.service';
import { ReadingListItem } from './reading_list_item';
import { ReadingListLocalFileService } from './db/reading-list-local-file.service';

@Injectable()
export class ReadingListService implements ReadingListInterfaceService {
  constructor(
    private readonly readingListCacheDbService: ReadingListCacheDbService,
    private readonly readingListLocalFileService: ReadingListLocalFileService,
    private readonly logger: Logger,
  ) {
    this.init().then(() => this.logger.log(`Finished loading`));
  }

  async init(): Promise<void> {
    const items: ReadingListItem[] = await this.readingListLocalFileService.load();
    for (const readingListItem of items) {
      this.logger.log(`Loaded ${readingListItem.id}`);
      this.readingListCacheDbService.saveReadingListItem(readingListItem);
    }
  }
  async heartBeat(): Promise<string> {
    this.logger.log('heartBeat');
    return 'heartBeat';
  }

  async createReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('reading_list was created');
    return this.readingListCacheDbService.saveReadingListItem(p);
  }

  async getAllReadingListItems(): Promise<ReadingListItem[]> {
    this.logger.log('get all reading list Items');
    return this.readingListCacheDbService.getAllReadingListItems();
  }

  async getReadingListItem(id: string): Promise<ReadingListItem> {
    this.logger.log('get reading list item');
    return this.readingListCacheDbService.getReadingListItem(id);
  }

  async patchReadingListItem(
    id: string,
    isDone: boolean,
  ): Promise<ReadingListItem> {
    this.logger.log('patch reading_list');
    return this.readingListCacheDbService.patchReadingListItem(id, isDone);
  }

  async updateReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('update reading_list');
    return this.readingListCacheDbService.updateReadingListItem(p);
  }

  async deleteReadingListItem(id: string): Promise<ReadingListItem> {
    this.logger.log('delete reading_list');
    return this.readingListCacheDbService.deleteReadingListItem(id);
  }
}
