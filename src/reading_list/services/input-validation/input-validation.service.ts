import {
  BadRequestException,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { ReadingListItem } from '../../dto/reading_list_item';
import { ProtocolBufferService } from '../../protocol_buffer/protocol-buffer.service';
import { InputValidationInterface } from './input-validation.interface';

@Injectable()
export class InputValidationService implements InputValidationInterface {
  constructor(
    private protocolBufferService: ProtocolBufferService,
    private logger: Logger,
  ) {}

  async processOutput(
    readingListItem: ReadingListItem,
    isBuffer: boolean,
  ): Promise<ReadingListItem | Uint8Array> {
    let result: ReadingListItem | Uint8Array;
    if (isBuffer) {
      result = await this.protocolBufferService.encode(readingListItem);
    } else {
      result = readingListItem;
    }
    return result;
  }

  async processInput(
    body: ReadingListItem | Uint8Array,
    isBuffer: boolean,
  ): Promise<ReadingListItem> {
    let item: ReadingListItem;

    if (isBuffer) {
      const decoded: {
        [key: string]: any;
      } = await this.protocolBufferService.decode(body['data']);
      if (
        !decoded.hasOwnProperty('id') ||
        !decoded.hasOwnProperty('txt') ||
        !decoded.hasOwnProperty('isDone')
      ) {
        throw new BadRequestException('Request doesnt have all data');
      }
      this.logger.log('Decoded the body input.');
      item = new ReadingListItem(
        decoded['id'],
        decoded['txt'],
        decoded['isDone'],
      );
    } else {
      if (
        !body.hasOwnProperty('id') ||
        !body.hasOwnProperty('txt') ||
        !body.hasOwnProperty('isDone')
      ) {
        throw new BadRequestException('Request doesnt have all data');
      }
      item = new ReadingListItem(body['id'], body['txt'], body['isDone']);
    }
    return item;
  }
}
