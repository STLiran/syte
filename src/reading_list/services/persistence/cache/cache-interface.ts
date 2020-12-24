import { ReadingListItem } from '../../../dto/reading_list_item';

export interface CacheInterface {
  saveReadingListItem(p: ReadingListItem): ReadingListItem;

  getAllReadingListItems(): ReadingListItem[];

  getReadingListItem(id: string): ReadingListItem;

  patchReadingListItem(id: string, isDone: boolean): ReadingListItem;

  updateReadingListItem(p: ReadingListItem): ReadingListItem;

  deleteReadingListItem(id: string): ReadingListItem;
}
