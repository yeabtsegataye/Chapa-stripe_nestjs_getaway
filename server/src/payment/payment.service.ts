import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ChapaService } from 'chapa-nestjs';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private readonly chapaService: ChapaService,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const tx_ref = await this.chapaService.generateTransactionReference();
    // const bannks = await this.chapaService.getBanks();
    //console.log(tx_ref, '11');

    const response = await this.chapaService.initialize({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@gmail.com',
      currency: 'ETB',
      amount: createPaymentDto.amount.toString(),
      tx_ref: tx_ref,
      callback_url: 'https://example.com/',
      return_url: 'https://www.instagram.com/direct/t/17843036303486946//',
      customization: {
        title: 'Test Title',
        description: 'Test Description',
      },
    });

    // console.log(response, 'rsssss');
    if (response.status === 'success') {
      const verifyPayment = await this.chapaService.verify({
        tx_ref: tx_ref,
      });

      if (verifyPayment.status === 'success') {
        const payment = this.paymentsRepository.create({
          ...createPaymentDto,
          status: verifyPayment.status,
          transaction_id: tx_ref,
        });

        await this.paymentsRepository.save(payment);
      } else {
        throw new Error('something went wrong while verifing payment');
      }
      return response;
    } else {
      throw new Error('Payment initialization failed');
    }
  }

}
