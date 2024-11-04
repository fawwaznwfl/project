import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LatihanModule } from './latihan/latihan.module';
import { TugasModule } from './tugas/tugas.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { BookModule } from './book/book.module';
import { UjianModule } from './ujian/ujian.module';
import { SiswaModule } from './siswa/siswa.module';
import { AuthModule } from './app/auth/auth.module';
import { MailModule } from './app/mail/mail.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
     useFactory  : async () => {
        const {typeOrmConfig} = await import('./config/typeorm.config')
        return typeOrmConfig
      },
    }),
    LatihanModule,
    TugasModule,
    BookModule,
    UjianModule,
    SiswaModule,
    AuthModule,
    MailModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
