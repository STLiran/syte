import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { ReadingListInterface } from './reading-list.interface';
import { CacheService } from './persistence/cache/cache.service';
import { ReadingListItem } from '../dto/reading_list_item';
import { LocalFileService } from './persistence/local-file/local-file.service';
import { Subject } from 'rxjs';

@Injectable()
export class ReadingListService
  implements ReadingListInterface, OnModuleDestroy {
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

  async persist(): Promise<void> {
    this.logger.log('Persisting');
    const items: ReadingListItem[] = await this.getAllReadingListItems();
    await this.localFileService.persist(items);
    this.logger.log('Persisting finished');
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

  async createReadingListItem(p: ReadingListItem): Promise<ReadingListItem> {
    this.logger.log('Creating reading_list item');
    return this.cacheService.saveReadingListItem(p);
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

  // Create an rxjs Subject that your application can subscribe to
  private shutdownListener$: Subject<void> = new Subject();

  // Your hook will be executed
  async onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
    //TODO
    await this.persist();
  }

  // Subscribe to the shutdown in your main.ts
  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  // Emit the shutdown event
  shutdown() {
    this.shutdownListener$.next();
  }
}
