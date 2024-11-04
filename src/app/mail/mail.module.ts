import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';


@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST ||'mail.smkmadinatulquran.sch.id', //sesuaikan konfigurasi 
        port: 465,
        connectionTimeout: 10000,
        secure: true,
        auth: {
          user: process.env.MAIL_USER ||'latihan-kirim-email@smkmadinatulquran.sch.id',  //sesuaikan user
          pass: process.env.MAIL_PASS ||'SMKMQ2024', //sesuaikan password 
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),  // template akan di ambil dari handlebar yang ada pada folder templates
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export  mailService agar bisa digunakan di luar module mail
})
export class MailModule {}