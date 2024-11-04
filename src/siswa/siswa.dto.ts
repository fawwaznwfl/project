import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsByteLength,
  IsDate,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { title } from 'process';



export class siswaDto {
  @IsOptional()
  id: number;

  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  nama: string;

  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  tempat_lahir: string;

  @IsNotEmpty({ message: 'Tanggal lahir tidak boleh kosong' })
  @IsDateString({}, {message : "Format Tanggal Lahir salah"}) // Ubah ke IsDateString
  tanggal_lahir: string; 
  
  @IsOptional()
  @IsNumberString()
  @Length(10, 10, { message: "NISN harus terdiri dari 10 karakter" })
  nisn: string;

  @IsOptional()
  @IsNumberString()
  @Length(16, 16, { message: "NIK harus terdiri dari 16 karakter" })
  nik: string;

  @IsOptional()
  alamat?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email salah, harap masukkan email yang valid' }) // Validasi format email
  email?: string;
}


export class findAllSiswa extends siswaDto {
    @IsInt()
    @Type(() => Number)
    page = 1;
  
    @IsInt()
    @Type(() => Number)
    pageSize = 10;
  
    @IsOptional()
    @IsInt()
    limit : number
  
    @IsString()
    @IsOptional()
    nama : string
  
    @IsOptional()
    tempat_lahir : string
  
    @IsOptional()
    tanggal_lahir : string
    
    @IsOptional()
    nisn : string

    @IsOptional()
    nik : string

    
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    from_year : number
  
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    to_year : number
  
    @IsOptional()
    keyword : string
  }
 
 export class createSiswaDto extends OmitType (siswaDto,  ['id']) {}
  
    export class updateSiswaDto extends siswaDto {}