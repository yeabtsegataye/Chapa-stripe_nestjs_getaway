// src/payments/payments.controller.ts

import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto){
    return this.paymentsService.createPayment(createPaymentDto);
  }
}
