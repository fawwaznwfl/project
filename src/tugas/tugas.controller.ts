import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TugasService } from './tugas.service';


@Controller('tugas')
export class TugasController {

    constructor(
        private readonly TugasService : TugasService
    ) {}

    //soal 1
    @Get("list")
    detail(){
        return this.TugasService.getList(1, 10)
    }
    //soal 2
    @Get('detail/:id')
    detail2(@Param('id') id : string){
        return this.TugasService.getListById(id)
    }
    @Post()
    save(@Body() payload: any){
        return this.TugasService.Save(payload)
    }
    @Delete("Delet/:id")
    hapus(@Param('id') id :string){
        return this.TugasService.deletId(id)
    }
}


