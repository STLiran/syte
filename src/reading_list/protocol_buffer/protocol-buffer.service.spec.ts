import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolBufferService } from './protocol-buffer.service';
import { Logger } from '@nestjs/common';

describe('ProtocolBufferService', () => {
  let service: ProtocolBufferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolBufferService, Logger],
    }).compile();

    service = module.get<ProtocolBufferService>(ProtocolBufferService);
  });

  it('Decode should reverted encoded value to this original form', async () => {
    const payload = { id: 'id' };
    const encoded = await service.encode(payload);
    const decoded = await service.decode(encoded);
    expect(payload).toEqual(decoded);
  });
});
