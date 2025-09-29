import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/fillters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: true, // Allow all origins for development
      credentials: true, // Important for cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });

    // Cookie parser middleware
    app.use(cookieParser());

    app.setGlobalPrefix('api/v1');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Loại bỏ properties không có trong DTO
        forbidNonWhitelisted: true, // Throw error nếu có extra properties
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Global response interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());

    const port = 3000; // Fixed port
    await app.listen(port);
    console.log(`🚀 Backend running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start backend:', error);
    throw error; // Let Docker handle the exit
  }
}
bootstrap();
