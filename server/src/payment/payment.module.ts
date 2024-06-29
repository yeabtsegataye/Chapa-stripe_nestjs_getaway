// src/payments/payments.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Shoe } from 'src/shoes/entities/shoe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,Shoe])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
