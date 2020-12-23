import { ReadingListDbInterface } from './reading-list-db-interface';
import { ReadingListItem } from '../reading_list_item';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadingListMongoDbService implements ReadingListDbInterface {
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

  saveReadingListItem(p: ReadingListItem): ReadingListItem {
    return undefined;
  }

  updateReadingListItem(p: ReadingListItem): ReadingListItem {
    return undefined;
  }
}
