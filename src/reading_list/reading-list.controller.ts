import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ReadingListService } from './reading-list.service';
import { ReadingListItem } from './reading_list_item';
import { GrpcObject, ProtobufMessage } from 'grpc';
import { AwesomeMessage } from './AwesomeSubMessage';
import { Root } from 'protobufjs';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protoLoader = require('@grpc/proto-loader');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const grpc = require('grpc');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const protobuf = require('protobufjs');

@Controller('reading_list')
export class ReadingListController {
  constructor(
    private readonly readingListService: ReadingListService,
    private readonly protocolBuffersService: ProtocolBufferService,
    private logger: Logger,
  ) {}

  @Post()
  private async createReadingListItem(
    @Body() item: ReadingListItem,
  ): Promise<ReadingListItem> {
    const encoded = await this.protocolBuffersService.encode(item);
    const decoded = await this.protocolBuffersService.decode(encoded);
    this.logger.log('encoded' + encoded);
    this.logger.log('decoded' + decoded);
    return await this.readingListService.createReadingListItem(item);
  }

  @Get()
  private async getAllReadingListItems(): Promise<ReadingListItem[]> {
    return await this.readingListService.getAllReadingListItems();
  }

  @Get(':id')
  private async getReadingListItem(
    @Param('id') id: string,
  ): Promise<ReadingListItem> {
    return await this.readingListService.getReadingListItem(id);
  }

  @Put(':id')
  private async updateReadingListItem(
    @Body() p: ReadingListItem,
  ): Promise<ReadingListItem> {
    return await this.readingListService.updateReadingListItem(p);
  }

  // mark items as done
  @Patch(':id')
  private async patchReadingListItem(
    @Param('id') id: string,
    @Body() body: { isDone: boolean },
  ): Promise<ReadingListItem> {
    return await this.readingListService.patchReadingListItem(id, body.isDone);
  }

  @Delete(':id')
  private async deleteReadingListItem(
    @Param('id') id: string,
  ): Promise<ReadingListItem> {
    return await this.readingListService.deleteReadingListItem(id);
  }
}
