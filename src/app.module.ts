import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';
import { GroceryModule } from './grocery/grocery.module';

@Module({
  imports: [UsersModule, MongooseModule.forRoot(config.get().DATABASE_URL), GroceryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
