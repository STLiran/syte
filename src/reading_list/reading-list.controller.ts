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

  @Post('persist')
  async persist() {
    this.logger.log('Persisting..');
    await this.readingListService.persist();
    this.logger.log('Finished persisting');
  }

  @Post()
  async createReadingListItem(
    @Body() body: any,
  ): Promise<ReadingListItem | Uint8Array> {
    const isBuffer =
      body &&
      body.hasOwnProperty('type') &&
      body['type'] == 'Buffer' &&
      body.hasOwnProperty('data');
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
}
