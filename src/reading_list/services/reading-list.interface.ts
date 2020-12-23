import { ReadingListItem } from '../dto/reading_list_item';

export interface ReadingListInterface {
  heartBeat(): Promise<string>;

  createReadingListItem(p: ReadingListItem): Promise<ReadingListItem>;

  getAllReadingListItems(): Promise<ReadingListItem[]>;

  getReadingListItem(id: string): Promise<ReadingListItem>;

  patchReadingListItem(id: string, isDone: boolean): Promise<ReadingListItem>;

  updateReadingListItem(p: ReadingListItem): Promise<ReadingListItem>;

  deleteReadingListItem(id: string): Promise<ReadingListItem>;
}
