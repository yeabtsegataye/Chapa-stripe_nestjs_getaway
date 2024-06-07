import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shoe } from './entities/shoe.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Shoe])],
  controllers: [ShoesController],
  providers: [ShoesService],
})
export class ShoesModule {}
