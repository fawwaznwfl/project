import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { SiswaService } from './siswa.service';
import { createSiswaDto, findAllSiswa, updateSiswaDto, } from './siswa.dto';
import { Pagination } from 'src/utils/decorator/pagination.decorator';

@Controller('siswa')
export class SiswaController {
    constructor(private readonly SiswaService : SiswaService) {}

    @Get('list')
    async findAllSiswa(@Pagination() query:findAllSiswa) {
      return this.SiswaService.findAllSiswa(query);
    }

    @Post('create')
    async create(@Body() payload : createSiswaDto){
        return this.SiswaService.create(payload)
    }
    @Get('detail/:id')
    async detail(@Param('id') id : number){
      return this.SiswaService.detail(+id)
    }

    @Put('update/:id')
    async update(@Param('id') id : number, @Body() payload : updateSiswaDto){
      return this.SiswaService.update(+id, payload)
}
}