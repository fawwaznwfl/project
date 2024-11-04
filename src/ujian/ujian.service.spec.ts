import { Test, TestingModule } from '@nestjs/testing';
import { UjianService } from './ujian.service';

describe('UjianService', () => {
  let service: UjianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UjianService],
    }).compile();

    service = module.get<UjianService>(UjianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
