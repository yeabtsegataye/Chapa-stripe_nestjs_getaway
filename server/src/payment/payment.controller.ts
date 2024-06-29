// src/payments/payments.controller.ts

import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create_chapa')
  async chapaPayment(@Body() createPaymentDto: CreatePaymentDto){
    return this.paymentsService.chapaPayment(createPaymentDto);
  }
  //////////
  @Post('create_card')
  async cardPayment(@Body() createPaymentDto: CreatePaymentDto){
    return this.paymentsService.cardPayment(createPaymentDto);
  }
}
