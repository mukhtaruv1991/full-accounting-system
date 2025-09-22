import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS Configuration Update ---
  // Explicitly allowing the frontend origin
  app.enableCors({
    origin: [
      'http://localhost:3000', // For local development
      'https://full-accounting-frontend.onrender.com' // Your deployed frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // --- End of Update ---

  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Backend application is running on port: ${port}`);
}
bootstrap();
