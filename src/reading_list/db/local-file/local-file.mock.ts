import { Injectable } from '@nestjs/common';
import { LocalFileInterface } from './local-file.interface';
import { ReadingListItem } from '../../dto/reading_list_item';

@Injectable()
export class LocalFileMock implements LocalFileInterface {
  get(): ReadingListItem[] {
    return [];
  }

  getGood(): Promise<ReadingListItem[]> {
    return undefined;
  }

  load(): Promise<ReadingListItem[]> {
    return undefined;
  }

  delete(): Promise<boolean> {
    return new Promise<boolean>(() => true);
  }

  save(items: ReadingListItem[]): Promise<ReadingListItem[]> {
    return new Promise<ReadingListItem[]>(() => []);
  }
}
