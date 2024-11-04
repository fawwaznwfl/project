import { Module } from '@nestjs/common';
import { UjianController } from './ujian.controller';
import { UjianService } from './ujian.service';

@Module({
  controllers: [UjianController],
  providers: [UjianService]
})
export class UjianModule {}
