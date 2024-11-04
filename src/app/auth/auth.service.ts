import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/respons.utils';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto, ResetPasswordDto } from './auth.dto';
import { ResponSucces } from 'src/Interface';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';
import { ResetPassword } from './reset_password.entity';

@Injectable()
export class AuthService extends BaseResponse {
  constructor(
    @InjectRepository(User) private readonly authRepository: Repository<User>,
    @InjectRepository(ResetPassword) private readonly resetPasswordRepository: Repository<ResetPassword>,
    private jwtService : JwtService,
    private mailService : MailService
  ) {
    super();
  }
  generateJWT(payload: jwtPayload, expiresIn: string | number, token: string) {
    return this.jwtService.sign(payload, {
      secret: token,
      expiresIn: expiresIn,
    });
  } //membuat method untuk generate jwt

  async register(payload: RegisterDto): Promise<ResponSucces> {
    // cek email sduah ada atau belom
    const checkUserExist = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (checkUserExist) {
        throw new HttpException(
            'Email sudah digunakan',
            HttpStatus.FOUND,
        )
    }

    //hash password
    payload.password = await hash(payload.password, 12);
    await this.authRepository.save(payload);
    return this._succes('Register Berhasil');
  }

  async refreshToken(id: number, token: string): Promise<ResponSucces> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        id: id,
        refresh_token: token,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    console.log('user', checkUserExists);
    if (checkUserExists === null) {
      throw new UnauthorizedException();
    }

    const jwtPayload: jwtPayload = {
      id: checkUserExists.id,
      nama: checkUserExists.nama,
      email: checkUserExists.email,
    };

    const access_token = await this.generateJWT(
      jwtPayload,
      '1d',
      process.env.REFRESH_TOKEN_SECRET,
    );

    const refresh_token = await this.generateJWT(
      jwtPayload,
      '7d',
      process.env.REFRESH_TOKEN_SECRET,
    );

    await this.authRepository.save({
      refresh_token: refresh_token,
      id: checkUserExists.id,
    });

    return this._succes('Success', {
      ...checkUserExists,
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

// login

  async login(payload: LoginDto): Promise<ResponSucces> {
    const checkUserExists = await this.authRepository.findOne({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        nama: true,
        email: true,
        password: true,
        refresh_token: true,
      },
    });

    if (!checkUserExists) {
      throw new HttpException(
        'User tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const checkPassword = await compare(
      payload.password,
      checkUserExists.password,
    ); // compare password yang dikirim dengan password yang ada di tabel
    if (checkPassword) {

      const jwtPayload : jwtPayload={
        id : checkUserExists.id,
        nama : checkUserExists.nama,
        email : checkUserExists.email
      }
      const accses_token = await this.generateJWT(
        jwtPayload,
        "30d",
        process.env.ACCSES_TOKEN_SECRET
      )

      const refresh_token= await this.generateJWT(
        jwtPayload,
        "1d",
        process.env.REFRESH_TOKEN_SECRET
      )

      await this.authRepository.update({
        id: checkUserExists.id,
        
      },
      {
        refresh_token: refresh_token,
      });

      return this._succes('Login Success', {
        ...checkUserExists,
        accses_token,
        refresh_token
    
      });
    } else {
      throw new HttpException(
        'email dan password tidak sama',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
    
  async forgotPassword(email: string): Promise<ResponSucces> {
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException(
        'Email tidak ditemukan',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const token = randomBytes(32).toString('hex'); // membuat token
    // const link = `${process.env.BASE_URL}/auth/reset-password?token=${token}&id=${user.id}`; //membuat link untuk reset password
    const link = `http://localhost:5002/auth/reset-password/${user.id}/${token}`;
    console.log('Link', link);
    // await this.mailService.sendForgotPassword({
    //   email: email,
    //   name: user.nama,
    //   link: link,
    // });

    const payload = {
      user: {
        id: user.id,
      },
      token: token,
    };

    await this.resetPasswordRepository.save(payload); // menyimpan token dan id ke tabel reset password

    return this._succes('Silahkan Cek Email');
  }
  async resetPassword(
    user_id: number,
    token: string,
    payload: ResetPasswordDto,
  ): Promise<ResponSucces> {
    const userToken = await this.resetPasswordRepository.findOne({    //cek apakah user_id dan token yang sah pada tabel reset password
      where: {
        token: token,
        user: {
          id: user_id,
        },
      },
    });

    if (!userToken) {
      throw new HttpException(
        'Token tidak valid',
        HttpStatus.UNPROCESSABLE_ENTITY,  // jika tidak sah , berikan pesan token tidak valid
      );
    }

    payload.new_password = await hash(payload.new_password, 12); //hash password
    await this.authRepository.save({  // ubah password lama dengan password baru
      password: payload.new_password,
      id: user_id,
    });
    await this.resetPasswordRepository.delete({ // hapus semua token pada tabel reset password yang mempunyai user_id yang dikirim, agar tidak bisa digunakan kembali
      user: {
        id: user_id,
      },
    });

    return this._succes('Reset Passwod Berhasil, Silahkan login ulang');
  }
}
