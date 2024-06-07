import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shoe } from './entities/shoe.entity';

@Injectable()
export class ShoesService {
  constructor(
    @InjectRepository(Shoe)
    private shoesRepository: Repository<Shoe>,
  ) {}

  findAll(): Promise<Shoe[]> {
    return this.shoesRepository.find();
  }

  async findOne(id: number): Promise<Shoe> {
    const shoe = await this.shoesRepository.findOne({ where: { id } });
    if (!shoe) {
      throw new NotFoundException(`Shoe with ID ${id} not found`);
    }
    return shoe;
  }
  
}
