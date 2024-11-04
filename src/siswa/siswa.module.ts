import { Module } from '@nestjs/common';
import { SiswaController } from './siswa.controller';
import { SiswaService } from './siswa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Siswa } from './siswa.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Siswa])],
  controllers: [SiswaController],
  providers: [SiswaService]
})
export class SiswaModule {}
