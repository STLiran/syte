import { ReadingListItem } from '../../../dto/reading_list_item';

export interface LocalFileInterface {
  load(): Promise<ReadingListItem[]>;

  persist(items: ReadingListItem[]): Promise<ReadingListItem[]>;

  delete(): Promise<boolean>;
}
