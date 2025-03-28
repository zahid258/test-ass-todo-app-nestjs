// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
     origin: '*',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
     credentials: true,
     allowedHeaders: 'Content-Type, Accept, Authorization',
   });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await mongoose.connect(process.env.MONGODB_URI as string)
  mongoose.connection.on('connected', () => {
    console.log('[MongoDB Direct] Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB Direct] Connection error:', err);
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3002);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();