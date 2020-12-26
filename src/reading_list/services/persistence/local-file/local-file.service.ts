import { ReadingListItem } from '../../../dto/reading_list_item';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { LocalFileInterface } from './local-file.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gracefulFs = require('graceful-fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lineReader = require('line-reader');

@Injectable()
export class LocalFileService implements LocalFileInterface {
  private _PATH;
  cacheService: CacheService;
  logger: Logger;

  constructor(logger: Logger, cacheService: CacheService) {
    this.cacheService = cacheService;
    this.logger = logger;
    this._PATH = 'src/reading_list/resources/todo_list.txt';
  }

  async load(): Promise<ReadingListItem[]> {
    const arr: ReadingListItem[] = [];
    await lineReader.eachLine(this._PATH, async (line) => {
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      await this.cacheService.saveReadingListItem(item);
      arr.push(item);
    });
    return arr;
  }

  async addToTxt(items: ReadingListItem[]): Promise<ReadingListItem[]> {
    try {
      this.logger.log(`saving ${items?.length} items`);
      const stream = await gracefulFs.createWriteStream(this._PATH, {
        flags: 'a+',
      });
      this.logger.log(`Save items: saving ${items?.length} items.`);
      await items.forEach((item) => {
        this.logger.log(`Saved: ${item.id}`);
        stream.write(`${item.id}:${item.txt}:${item.isDone ? 'V' : 'X'}\n`);
      });
      this.logger.log(`Finished saving items: saved ${items?.length} items.`);
      await stream.end();
      return items;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return [];
    }
  }

  async persist(items: ReadingListItem[]): Promise<ReadingListItem[]> {
    try {
      this.logger.log(`Persisting ${items?.length} items`);
      // {flags: 'w'} erase and write a new file
      const stream = await gracefulFs.createWriteStream(this._PATH, {
        flags: 'w',
      });
      await items.forEach((item) => {
        this.logger.log(`Saved: ${item.id}`);
        stream.write(`${item.id}:${item.txt}:${item.isDone ? 'V' : 'X'}\n`);
      });

      await stream.end();
      return items;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return [];
    }
  }

  async delete(): Promise<boolean> {
    try {
      this.logger.log(`Cleaning local file`);
      await gracefulFs.truncate(this._PATH, () =>
        this.logger.log('Finished deleting file content'),
      );
      return true;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return false;
    }
  }

  set PATH(value: string) {
    this._PATH = value;
  }
}
