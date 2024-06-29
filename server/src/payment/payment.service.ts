import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ChapaService } from 'chapa-nestjs';
import { Shoe } from 'src/shoes/entities/shoe.entity';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private readonly chapaService: ChapaService,
    @InjectRepository(Shoe)
    private shoesRepository: Repository<Shoe>,
  ) {}

  async chapaPayment(createPaymentDto: CreatePaymentDto) {
    const TITLE_LIMIT = 16;
    const DESCRIPTION_LIMIT = 50;

    const data = await this.shoesRepository.query(
      `SELECT * FROM shoe where id = ?`,
      [createPaymentDto.shoe_id],
    );
    // console.log(data[0].price, 'data');
    if (data.length == 0) return { msg: 'somthing went wrong' };

    const tx_ref = await this.chapaService.generateTransactionReference();
    //const bannks = await this.chapaService.getBanks();
    //console.log(tx_ref, '11');
    const response = await this.chapaService.initialize({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@gmail.com',
      currency: 'ETB',
      amount: data[0].price.toString(),
      tx_ref: tx_ref,
      callback_url: 'https://example.com/',
      return_url: 'https://www.instagram.com/',
      customization: {
        title: this.truncate(data[0].name, TITLE_LIMIT), // Truncate the title if needed
        description: this.truncate(data[0].description, DESCRIPTION_LIMIT), // Truncate the description if needed
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
          amount: data[0].price,
          shoe_id: data[0].id,
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

  async cardPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Retrieve the items based on the provided IDs (assuming `createPaymentDto.shoe_id` is an array of IDs)
      const ids = createPaymentDto.shoe_id;
      const placeholders = ids.map(() => '?').join(', ');
      const data = await this.shoesRepository.query(
        `SELECT * FROM shoe WHERE id IN (${placeholders})`,
        ids,
      );

      // Check if items were retrieved successfully
      if (data.length === 0)
        return { msg: 'No items found for the provided IDs' };

      // Map the items to Stripe's line items format
      const line_items = data.map((item) => ({
        price_data: {
          currency: 'usd', // Use the appropriate currency
          product_data: {
            name: item.name,
            images: [item.imageUrl], // Include the image URL
          },
          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: 1, // Quantity (you can adjust this based on your requirements)
      }));

      // Create a Checkout session with the line items
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: 'http://localhost:5173/', // Customize your success URL
        cancel_url: 'http://localhost:5173/cancel', // Customize your cancel URL
        metadata: {
          user_id: createPaymentDto.user_id.toString(),
          shoe_ids: createPaymentDto.shoe_id.join(','), // Join the IDs for metadata
        },
      });

      // Return the session URL for the client to complete the payment
      return { url: session.url };
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Payment initialization failed');
    }
  }
  // Utility function to truncate strings
  truncate(str: string, maxLength: number): string {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 3) + '...'; // Subtract 3 to accommodate '...' and prevent exceeding maxLength
    }
    return str;
  }
}
