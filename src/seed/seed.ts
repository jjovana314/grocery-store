// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  const seedService = app.get(SeedService);

  const logger = new Logger('Seed');

  try {
    logger.log('Starting database seed...');
    await seedService.runSeed();
    logger.log('Seeding completed successfully!');
  } catch (err) {
    logger.error('Seeding failed:', err);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
