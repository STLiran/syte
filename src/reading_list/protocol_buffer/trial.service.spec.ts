import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolBufferService } from './protocol-buffer.service';

describe('TrialService', () => {
  let service: ProtocolBufferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolBufferService],
    }).compile();

    service = module.get<ProtocolBufferService>(ProtocolBufferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
