import { ReadingListDbInterface } from './reading-list-db-interface';
import { ReadingListItem } from '../reading_list_item';
import { Injectable, Logger } from '@nestjs/common';
import { ReadingListCacheDbService } from './reading-list-cache-db.service';
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
export class ReadingListLocalFileService {
  //} implements ReadingListDbInterface {
  private PATH = 'src/reading_list/db/storage/todo_list.txt';

  constructor(
    private logger: Logger,
    private readingListCacheDbService: ReadingListCacheDbService,
  ) {}

  async load(): Promise<ReadingListItem[]> {
    const arr: ReadingListItem[] = [];
    //
    // await lineReader.eachLine(this.PATH, (line, last, cb) => {
    //   const temp: string[] = line.split(':');
    //   const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
    //   arr.push(item);
    //   // readingListCacheDbService.saveReadingListItem(item);
    //   if (!line) {
    //     cb(false); // stop reading
    //   } else {
    //     cb();
    //   }
    // });

    await lineReader.eachLine(this.PATH, async (line) => {
      const temp: string[] = line.split(':');
      const item = new ReadingListItem(temp[0], temp[1], temp[2] == 'V');
      await this.readingListCacheDbService.saveReadingListItem(item);
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

  save(items: ReadingListItem[]): ReadingListItem[] {
    try {
      // const stream = gracefulFs.createWriteStream(this.PATH, { flags: 'a+' });
      const stream = gracefulFs.createWriteStream(this.PATH, { flags: 'w' });
      this.logger.log(new Date().toISOString());
      items.forEach((item) => {
        stream.write(`${item.id}:${item.txt}:${item.isDone ? 'V' : 'X'}\n`);
      });
      console.log(new Date().toISOString());
      stream.end();
      return items;
    } catch (e) {
      this.logger.log('msg');
    }
  }

  deleteReadingListItem(id: string): ReadingListItem {
    return undefined;
  }

  getAllReadingListItems(): ReadingListItem[] {
    return [];
  }

  getReadingListItem(id: string): ReadingListItem {
    return undefined;
  }

  patchReadingListItem(id: string, isDone: boolean): ReadingListItem {
    return undefined;
  }

  // saveReadingListItem(item: ReadingListItem): ReadingListItem {
  //   this.save([item]);
  //   return item;
  // }

  updateReadingListItem(p: ReadingListItem): ReadingListItem {
    return undefined;
  }
}
