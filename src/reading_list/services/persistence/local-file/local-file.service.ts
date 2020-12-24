import { ReadingListItem } from '../../../dto/reading_list_item';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { LocalFileInterface } from './local-file.interface';
import { WriteStream } from 'fs';
import { gracefulify } from 'graceful-fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gracefulFs = require('graceful-fs');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lineReader = require('line-reader');

@Injectable()
export class LocalFileService implements LocalFileInterface {
  private PATH = 'src/reading_list/resources/todo_list.txt';

  constructor(private logger: Logger, private cacheService: CacheService) {}

  async load(): Promise<ReadingListItem[]> {
    const arr: ReadingListItem[] = [];
    await lineReader.eachLine(this.PATH, async (line) => {
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      await this.cacheService.saveReadingListItem(item);
      arr.push(item);
    });
    return arr;
  }

  async delete(): Promise<boolean> {
    try {
      this.logger.log(`Cleaning local file`);
      // {flags: 'w'} erase and write a new file
      const stream = gracefulFs.createWriteStream(this.PATH, { flags: 'w' });
      await stream.end();
      return true;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return false;
    }
  }

  async persist(items: ReadingListItem[]): Promise<ReadingListItem[]> {
    try {
      this.logger.log(`saving ${items?.length} items`);
      //   {flags: 'a' / 'a+' append and (plus for nonexistent as well)
      // const stream = await gracefulFs.createWriteStream(this.PATH, {
      //   flags: 'w',
      // });
      const stream = await fs.createWriteStream(this.PATH, { flags: 'w' });
      // this.sleep(30000);
      // setTimeout(async () => await this.saveItems(items, stream), 3000);
      // this.sleep(30000);
      // setTimeout(async () => await stream.end(), 3000);
      // await this.sleep(30000);
      await this.saveItems(items, stream);
      // await stream.end();
      return items;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return [];
    }
  }
  private sleep(ms): Promise<unknown> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  private async saveItems(
    items: ReadingListItem[],
    stream: WriteStream,
  ): Promise<void> {
    this.logger.log(`Save items: saving ${items?.length} items.`);
    await items.forEach((item) => {
      this.logger.log(`Saved: ${item.id}`);
      stream.write(`${item.id}:${item.txt}:${item.isDone ? 'V' : 'X'}\n`);
    });
    this.logger.log(`Finished saving items: saved ${items?.length} items.`);
    await stream.end();
  }
}
