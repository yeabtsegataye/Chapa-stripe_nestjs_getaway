import { Controller, Get, Param, } from '@nestjs/common';
import { ShoesService } from './shoes.service';


@Controller('shoes')
export class ShoesController {
  constructor(private readonly shoesService: ShoesService) {}

 
  @Get()
  findAll() {
    return this.shoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.shoesService.findOne(id);
  }

}
