import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { createBookDto, FindBookDto, UpdateBookDto } from './book.dto';
import { query } from 'express';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { JwtGuard } from 'src/app/auth/auth.guard';

@UseGuards(JwtGuard)
@Controller('book')
export class BookController {
  constructor(private BookService: BookService) {}


  @Get('list')
  async findAllBook(@Pagination() query:FindBookDto) {
    return this.BookService.findAllBook(query);
  }

 
  @Get("detail/:id")
  async detail(@Param('id') id : number){
    return this.BookService.detail(+id)
  }
  

  @Post("Tambah")
  async createBook(@Body() payload :createBookDto){
    console.log('payload', createBookDto);
    return this.BookService.create(payload)
  }

  @Put ("update/:id")
  async updateBook(@Body() payload : UpdateBookDto, @Param("id") id :string){
    return this.BookService.update(+id, payload)
  }

  @Delete("delete/:id")
  async deleteBook(@Param("id") id : number){
      return this.BookService.delete(id)
  }

  @Delete("delete")
  async deleteMulti(@Query("id") id : string){
    const idArray = id.split(",")
    return this.BookService.deleteMulti(idArray)
  }
}


