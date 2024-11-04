import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Siswa } from './siswa.entity';
import {
  Like,
  Repository,
} from 'typeorm';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { response } from 'express';
import BaseResponse from 'src/utils/respons.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponPagination, ResponSucces } from 'src/Interface';
import { Between } from 'typeorm';
import { createSiswaDto, findAllSiswa, updateSiswaDto } from './siswa.dto';
import { createBookDto } from 'src/book/book.dto';
import { MESSAGES } from '@nestjs/core/constants';

@Injectable()
export class SiswaService extends BaseResponse {
  constructor(
    @InjectRepository(Siswa)
    private siswaRepository: Repository<Siswa>,
  ) {
    super();
  }
  async findAllSiswa(query: findAllSiswa): Promise<ResponPagination> {
    const {
      page = 1,
      pageSize = 10,
      nama,
      tempat_lahir,
      tanggal_lahir,
      to_year,
      from_year,
      nisn,
      nik,
      keyword,
    } = query;

    const filter: { [key: string]: any } = {};
    const search: { [key: string]: any }[] = [];

    if (keyword) {
      search.push(
        { nama: Like(`%${keyword}%`) },
        { tempat_lahir: Like(`%${keyword}%`) },
        { tanggal_lahir: Like(`%${keyword}%`) },
        { year: Like(`%${keyword}%`) },
      );
    } else {
      if (nama) filter.nama = Like(`%${nama}%`);
      if (tempat_lahir) filter.tempat_lahir = Like(`%${tempat_lahir}%`);
      if (tanggal_lahir) filter.tanggal_lahir = Like(`%${tanggal_lahir}%`);
      if (nik) filter.nik = Like(`%${nik}%`);
      if (nisn) filter.nisn = Like(`%${nisn}%`);
      if (from_year && to_year) filter.year = Between(from_year, to_year);
      if (from_year && !to_year) filter.year = Between(from_year, from_year);
    }

    const skip = (page - 1) * pageSize;
    const result = await this.siswaRepository.find({
      where: keyword ? search : filter,
      skip: skip,
      take: Number(pageSize),
    });

    const total = await this.siswaRepository.count({ where: filter });
    const total_page = Math.ceil(total / pageSize);

    return this._pagination('OK', result, total, page, pageSize);
  }

  async detail(id:number):Promise<ResponSucces>{
    const result = await this.siswaRepository.findOne({
        where:{
            id : id     
        }
    });
    if(result === null){
        throw new NotFoundException('tidak nemu')
    }
    return {
        status:"Success",
        message:'OK',
        data:result
        }
    }

  async create(payload: createSiswaDto): Promise<ResponSucces> {
    try {
  
      const existingUser = await this.siswaRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
    
        throw new HttpException(
          'Email sudah digunakan',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const newUser = await this.siswaRepository.save(payload);

      return {
        status: 'success',
        message: 'Data berhasil dibuat',
        data: newUser,
      };
    } catch (error) {
     
      throw new HttpException(
        error.message || 'Ada kesalahan',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

    async update(id: number, payload: updateSiswaDto): Promise<ResponSucces> {
      const data = await this.siswaRepository.findOne({
        where: { id },
      });
      await this.siswaRepository.update(id, payload);
      const updatedData = await this.siswaRepository.findOne({ where: { id } });
      if (!data) {
        throw new NotFoundException('Siswa tidak ditemukan');
      }
      if (data.email === payload.email) {
        throw new HttpException(
          'Email sudah digunakan siswa lain',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      } 
    
      return {
        status: 'success',
        message: 'Siswa telah diupdate',
        data: updatedData,
      };
    }
}
