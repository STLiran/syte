import { ReadingListItem } from '../../dto/reading_list_item';

export interface InputValidationInterface {
  processOutput(
    readingListItem: ReadingListItem,
    isBuffer: boolean,
  ): Promise<ReadingListItem | Uint8Array>;

  processInput(
    body: ReadingListItem | Uint8Array,
    isBuffer: boolean,
  ): Promise<ReadingListItem>;
}
