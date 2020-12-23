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
import { ReadingListService } from './services/reading-list.service';
import { ReadingListItem } from './dto/reading_list_item';
import { ProtocolBufferService } from './protocol_buffer/protocol-buffer.service';

@Controller('reading_list')
export class ReadingListController {
  private _isProtocolBuffer = false;

  constructor(
    private readonly readingListService: ReadingListService,
    private readonly protocolBufferService: ProtocolBufferService,
    private logger: Logger,
  ) {
    // readingListService
    //   .init()
    //   .then(() => this.logger.log('Init reading list service'));
  }

  @Post()
  async createReadingListItem(@Body() body: any): Promise<ReadingListItem> {
    const item = await this.processInput(body);

    const readingListItem: ReadingListItem = await this.readingListService.createReadingListItem(
      item,
    );

    return await this.processOutput(readingListItem);
  }

  async processOutput(readingListItem: ReadingListItem) {
    let result;
    if (this._isProtocolBuffer) {
      result = await this.protocolBufferService.encode(readingListItem);
    } else {
      result = readingListItem;
    }
    return result;
  }

  async processInput(body: ReadingListItem) {
    let item;
    if (this._isProtocolBuffer) {
      const decoded = await this.protocolBufferService.decode(body);
      this.logger.log('Decoded the body input.');
      item = decoded;
    } else {
      item = body;
    }
    return item;
  }

  @Get()
  async getAllReadingListItems(): Promise<ReadingListItem[]> {
    return await this.readingListService.getAllReadingListItems();
  }

  @Get(':id')
  async getReadingListItem(@Param('id') id: string): Promise<ReadingListItem> {
    return await this.readingListService.getReadingListItem(id);
  }

  @Put(':id')
  async updateReadingListItem(
    @Body() p: ReadingListItem,
  ): Promise<ReadingListItem> {
    return await this.readingListService.updateReadingListItem(p);
  }

  // mark items as done
  @Patch(':id')
  async patchReadingListItem(
    @Param('id') id: string,
    @Body() body: { isDone: boolean },
  ): Promise<ReadingListItem> {
    return await this.readingListService.patchReadingListItem(id, body.isDone);
  }

  @Delete(':id')
  async deleteReadingListItem(
    @Param('id') id: string,
  ): Promise<ReadingListItem> {
    return await this.readingListService.deleteReadingListItem(id);
  }

  set isProtocolBuffer(value: boolean) {
    this._isProtocolBuffer = value;
  }
}
