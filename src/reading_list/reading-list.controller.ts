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
import { InputValidationService } from './services/input-validation/input-validation.service';

@Controller('reading_list')
export class ReadingListController {
  constructor(
    private readonly readingListService: ReadingListService,
    private readonly inputValidationService: InputValidationService,
    private logger: Logger,
  ) {}

  @Post()
  async createReadingListItem(
    @Body() body: any,
  ): Promise<ReadingListItem | Uint8Array> {
    this.logger.log('Creating list item request received');

    const isBuffer = this.inputValidationService.isProtocolBufferRequest(body);
    const item: ReadingListItem = await this.inputValidationService.processInput(
      body,
      isBuffer,
    );

    const readingListItem: ReadingListItem = await this.readingListService.createReadingListItem(
      item,
    );

    return await this.inputValidationService.processOutput(
      readingListItem,
      isBuffer,
    );
  }

  @Get()
  async getAllReadingListItems(): Promise<ReadingListItem[]> {
    this.logger.log('Get all list items request received');

    return await this.readingListService.getAllReadingListItems();
  }

  @Get(':id')
  async getReadingListItem(@Param('id') id: string): Promise<ReadingListItem> {
    this.logger.log('Get list item request received');

    return await this.readingListService.getReadingListItem(id);
  }

  @Put(':id')
  async updateReadingListItem(
    @Body() body: any,
  ): Promise<ReadingListItem | Uint8Array> {
    this.logger.log('Update list item request received');
    const isBuffer = this.inputValidationService.isProtocolBufferRequest(body);
    const item: ReadingListItem = await this.inputValidationService.processInput(
      body,
      isBuffer,
    );

    const readingListItem = await this.readingListService.updateReadingListItem(
      item,
    );
    return await this.inputValidationService.processOutput(
      readingListItem,
      isBuffer,
    );
  }

  // mark items as done/undone
  @Patch(':id')
  async patchReadingListItem(
    @Param('id') id: string,
    @Body() body: { isDone: boolean },
  ): Promise<ReadingListItem> {
    this.logger.log('Patch list item request received');

    return await this.readingListService.patchReadingListItem(id, body.isDone);
  }

  @Delete(':id')
  async deleteReadingListItem(
    @Param('id') id: string,
  ): Promise<ReadingListItem> {
    this.logger.log('Delete list item request received');

    return await this.readingListService.deleteReadingListItem(id);
  }
}
