import { ReadingListItem } from '../../dto/reading_list_item';
import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { LocalFileInterface } from './local-file.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gracefulFs = require('graceful-fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require('readline');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lineReader = require('line-reader');
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const es = require('event-stream');

@Injectable()
export class LocalFileService implements LocalFileInterface {
  private PATH = 'src/reading_list/resources/todo_list.txt';

  constructor(private logger: Logger, private cacheService: CacheService) {}

  async load(): Promise<ReadingListItem[]> {
    const arr: ReadingListItem[] = [];
    //
    // await lineReader.eachLine(this.PATH, (line, last, cb) => {
    //   const temp: string[] = line.split(':');
    //   const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
    //   arr.push(item);
    //   // cacheService.saveReadingListItem(item);
    //   if (!line) {
    //     cb(false); // stop reading
    //   } else {
    //     cb();
    //   }
    // });

    await lineReader.eachLine(this.PATH, async (line) => {
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      await this.cacheService.saveReadingListItem(item);
      arr.push(item);
    });
    return arr;
  }

  async getGood(): Promise<ReadingListItem[]> {
    const arr: ReadingListItem[] = [];
    await lineReader.eachLine(this.PATH, (line) => {
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      arr.push(item);
    });
    // .then(function (err) {
    //   if (err) throw err;
    //   console.log("I'm done!!");
    // });
    return arr;
  }

  get(): ReadingListItem[] {
    const arr: ReadingListItem[] = [];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const lineReader = require('line-reader');

    lineReader.eachLine(this.PATH, function (line, last) {
      console.log(line);
      if (!line) {
        return false; // stop reading
      }
    });

    const rd = readline.createInterface({
      input: fs.createReadStream(this.PATH),
      output: process.stdout,
      console: false,
    });

    rd.on('line', function (line) {
      console.log(line);
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      arr.push(item);
    });
    //
    // const lineReader = readline.createInterface({
    //   input: fs.createReadStream(this.PATH),
    // });
    //
    // lineReader.on('line', function (line) {
    //   console.log('Line from file:', line);
    // });
    //
    // const fileStream = fs.createReadStream(this.PATH);
    //
    // const rl = readline.createInterface({
    //   input: fileStream,
    //   crlfDelay: Infinity,
    // });
    // // Note: we use the crlfDelay option to recognize all instances of CR LF
    // // ('\r\n') in input.txt as a single line break.
    //
    // for (const line of rl) {
    //   // Each line in input.txt will be successively available here as `line`.
    //   console.log(`Line from file: ${line}`);
    // }
    //
    // const s = fs
    //   .createReadStream(this.PATH)
    //   .pipe(es.split())
    //   .pipe(
    //     es
    //       .mapSync(function (line) {
    //         s.pause();
    //         console.log('line:', line);
    //         s.resume();
    //       })
    //       .on('error', function (err) {
    //         console.log('Error:', err);
    //       })
    //       .on('end', function () {
    //         console.log('Finish reading.');
    //       }),
    //   );
    //
    // lineReader.eachLine(this.PATH, (line) => {
    //   console.log(line);
    //   const temp: string[] = line.split(':');
    //   const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
    //   arr.push(item);
    // });
    // readline.stream.
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

  async save(items: ReadingListItem[]): Promise<ReadingListItem[]> {
    try {
      this.logger.log(`saving ${items?.length} items`);
      //   {flags: 'a' / 'a+' append and (plus for nonexistent as well)
      const stream = gracefulFs.createWriteStream(this.PATH, { flags: "'a+" });
      items.forEach((item) => {
        stream.write(`${item.id}:${item.txt}:${item.isDone ? 'V' : 'X'}\n`);
      });
      await stream.end();
      return items;
    } catch (e) {
      this.logger.error('The following error has occurred', e);
      return [];
    }
  }
}
