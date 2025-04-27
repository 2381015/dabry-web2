import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';

const logger = new Logger('Serverless');
const expressApp = express();

// This is the serverless handler for Vercel
let cachedNestApp: any;

async function bootstrap() {
  if (!cachedNestApp) {
    logger.log('Initializing NestJS app for serverless deployment');
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    
    // API prefix
    app.setGlobalPrefix('api');
    
    // Enable CORS
    app.enableCors();
    
    await app.init();
    cachedNestApp = app;
  } else {
    logger.log('Using cached NestJS app instance');
  }
  
  return cachedNestApp;
}

// Handler for Vercel serverless function
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  
  // Forward the request to the NestJS app
  expressApp(req, res);
}
