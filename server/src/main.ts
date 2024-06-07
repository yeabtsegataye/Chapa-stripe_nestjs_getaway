import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use CORS middleware
  app.use(cors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

  // Logger middleware to log request method and path
  app.use((req, res, next) => {
    console.log(` ${req.method},  ${req.path}`);
    next();
  });

  await app.listen(3000);
}

bootstrap();
