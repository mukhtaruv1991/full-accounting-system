import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Comprehensive CORS Configuration ---
  // This is a more permissive setting to ensure requests are not blocked
  // by any CORS policy, especially the preflight OPTIONS requests.
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Explicitly handle OPTIONS requests for all routes
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      res.sendStatus(204); // No Content - The preflight request is successful
    } else {
      next();
    }
  });
  // --- End of CORS Update ---

  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Backend application is running on port: ${port}`);
}
bootstrap();
