import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShoesModule } from './shoes/shoes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from './payment/payment.module';
import { ChapaModule } from 'chapa-nestjs';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the ConfigModule globally available
    }),
    ChapaModule.register({
      secretKey: process.env.CHAPA_SECRET_KEY,//secretKey
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'tati',
      password: '123',
      database: 'chapa_ecommerce',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ShoesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

console.log(process.env.CHAPA_SECRET_KEY)
