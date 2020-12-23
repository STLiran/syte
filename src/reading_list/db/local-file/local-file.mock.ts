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

  save(items: ReadingListItem[]): ReadingListItem[] {
    return [];
  }
}
