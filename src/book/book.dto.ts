import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsByteLength,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
} from 'class-validator';
import { title } from 'process';

export class BookDto {
  @IsOptional()
  id: number;

  @IsNotEmpty({ message: 'Title tidak boleh kosong' })
  @Length(5)
  title: string;

  @IsNotEmpty()
  author: string;

  @IsInt({message : "minimal 2020"}) // year wajib number
  @Min(2020, {message : "Minimal tahun 2020"}) // minimal tahun adalah 2020
  @Max(2023, {message : "Maximal tahun 2023"})
  year: number;

  @IsNotEmpty()
  @IsByteLength(10)
  deskripsi: string;
}

// export class CreateBookDto {
//     title: string;
//     author: string;
//     year: number;
//   }

export class createBookDto extends OmitType(BookDto, ['id']) {}
export class UpdateBookDto extends BookDto {}
export class FindBookDto {
  @IsInt()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Type(() => Number)
  pageSize = 10;

  @IsOptional()
  @IsInt()
  limit : number

  @IsOptional()
  title : string

  @IsOptional()
  author : string

  @IsOptional()
  deskripsi : string
  
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

[
  {
    title : "Buku cerpen",
    year : 2023
  },
  {
    author : "Fyon"
  },
  {
    deskripsi : "buku bagus"
  }
]
