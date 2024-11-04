import { Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import { LatihanService } from './latihan.service';





@Controller('latihan')// untuk mengatur url, bisa di ganti yg lain
export class LatihanController {
    constructor(
        private readonly latihanService : LatihanService
    ) {}

 @Get()
 findAll(@Query() query: any){
    return this.latihanService.findAll(query)
}

   
    @Get('detail/:id/:name')
    detail(@Param('id') id:string, @Param('name') name:string){
       return this.latihanService.findDetail(id, name)
    }
    @Get("simpan")
    register(@Body() payload:any){
        return this.latihanService.register(payload)
    }

   
    @Put("update/:id")
    login(@Body() payload :any, @Param('id') id:string){
        return{
            method : 'put',
            id_user : `${id}`,
            payload : payload
            
        }
    }
}

