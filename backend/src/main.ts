import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = 3000; // Fixed port
    await app.listen(port);
    console.log(`🚀 Backend running on port ${port}`);
  } catch (error) {
    console.error('❌ Failed to start backend:', error);
    throw error; // Let Docker handle the exit
  }
}
bootstrap();
