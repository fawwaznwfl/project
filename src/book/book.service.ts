import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Like, Repository } from 'typeorm';
import { Interface } from 'readline';
import { ResponPagination, ResponSucces } from 'src/Interface';
import BaseResponse from 'src/utils/respons.utils';
import { createBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { query } from 'express';
import { filter, from } from 'rxjs';
import { Between } from 'typeorm';

@Injectable()
export class BookService extends BaseResponse {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {
    super();
  }

  // di sini kita akan membuat API untuk mengakses smua data di table book
  async findAllBook(query: FindBookDto): Promise<ResponPagination> {
    const {
      page,
      pageSize,
      limit,
      title,
      author,
      to_year,
      from_year,
      deskripsi,
      keyword,
    } = query;

    const filter: {
      [key: string]: any;
    } = {};

    const search: {
      [key: string]: any;
    }[] = [];
    if (keyword) {
      search.push(
        {
          title: Like(`%${keyword}%`),
        },
        {
          author: Like(`%${keyword}%`),
        },
        {
          deskripsi: Like(`%${keyword}%`),
        },
        {
          year : Like(`%${keyword}%`)
        }
      );
    } else {
      if (author) {
        filter.author = Like(`%${author}%`);
      }
      if (title) {
        filter.title = Like(`%${title}%`);
      }
      if (deskripsi) {
        filter.deskripsi = Like(`%${deskripsi}%`);
      }
      if (from_year && to_year) {
        filter.year = Between(from_year, to_year);
      }
      if (from_year && !to_year) {
        filter.year = Between(from_year, from_year);
      }
    }

    console.log('filter', filter);
    console.log('search', search);
    const result = await this.bookRepository.find({
      where: keyword ? search : filter,
      skip: limit,
      take: Number(pageSize),
    });
    const total = await this.bookRepository.count({
      where: filter,
    });
    console.log(query);
    // const page = query.page
    // const pageSize = query.pageSize
    return this._pagination(
      'list buku ditemukan',
      result,
      total,
      page,
      pageSize,
    );
  }

  //Menambah buku untuk mausk ke list
  async create(payload: createBookDto): Promise<ResponSucces> {
    //untuk menyimpan data
    try {
      const save = await this.bookRepository.save(payload);
      return this._succes('berhasil menambah buku');
      //jika eror akan masuk ke bagian sini
    } catch (off) {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
    } finally {
      //jika sudah selesai akan di proses ini
      console.log('proses berjalan lancar');
    }
  }

  async detail(id: number): Promise<ResponSucces> {
    {
      const result = await this.bookRepository.findOne({
        where: {
          id: id,
        },
      });

      if (result === null) {
        throw new NotFoundException('buku tidak di temukan');
      }

      return this._succes('detail buku telah di temukan', result);
    }
  }

  async update(id: number, payload: UpdateBookDto): Promise<ResponSucces> {
    try {

      //menggunakan update, id di atas
      const result = await this.bookRepository.update(id, {
        title: payload.title,
        year: payload.year,
        deskripsi: payload.deskripsi,
        author: payload.author,
      });
      if (result.affected === 0) {
        throw new HttpException(
          'Data tidak di temukan',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        status: 'succeses',
        message: 'update berhasil',
        data: result,
      };
    } catch (error) {
      throw new HttpException('Ada kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: number): Promise<ResponSucces> {
    const deleted = await this.bookRepository.delete(id);
    if (deleted.affected === 0) {
      throw new HttpException('Data tidak di temukan', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'succeses',
      message: 'buku berhasil di hapus',
      data: deleted,
    };
  }
  async deleteMulti(array: string[]): Promise<ResponSucces> {
    const deleted = await this.bookRepository.delete(array);
    if (deleted.affected === 0) {
      throw new HttpException('Data tidak di temukan', HttpStatus.BAD_REQUEST);
    }
    return {
      status: 'succeses',
      message: `berhasil menghapus ${deleted.affected} buku`,
      data: deleted,
    };
  }
}
