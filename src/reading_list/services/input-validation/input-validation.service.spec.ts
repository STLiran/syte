import { Test, TestingModule } from '@nestjs/testing';
import { InputValidationService } from './input-validation.service';
import { ProtocolBufferService } from '../../protocol_buffer/protocol-buffer.service';
import { Logger } from '@nestjs/common';

describe('InputValidationService', () => {
  let service: InputValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InputValidationService, ProtocolBufferService, Logger],
    }).compile();

    service = module.get<InputValidationService>(InputValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
