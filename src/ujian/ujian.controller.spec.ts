import { Test, TestingModule } from '@nestjs/testing';
import { UjianController } from './ujian.controller';

describe('UjianController', () => {
  let controller: UjianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UjianController],
    }).compile();

    controller = module.get<UjianController>(UjianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
