import { Controller, Get, Post, Put, Delete, Patch, } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

@Put()
gwtPut(){
  return `ini meethodny`
}

  @Post()
  create(): string{
    return 'ok';
  }

  @Post('tes')
  create2(): string{
    return 'ok';
  }
  @Get()
  getHello(): string {
    return "belajar Routing NestJS"
  }
  @Get("list")
  getHello2(): string {
    return "belajar Routing jS"
  }
}               

