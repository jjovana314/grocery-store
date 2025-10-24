import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';

@Module({
  imports: [UsersModule, MongooseModule.forRoot(config.get().DATABASE_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
