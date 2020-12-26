import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { LocalFileService } from './local-file.service';

@Injectable()
export class LocalFileMock extends LocalFileService {
  constructor(logger: Logger, cacheService: CacheService) {
    super(logger, cacheService);
    this.PATH = 'src/reading_list/resources/todo_list_test.txt';
  }
}
