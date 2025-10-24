import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/config/config';
import { GroceryController } from './grocery/grocery.controller';
import { GroceryService } from './grocery/grocery.service';
import { GroceryModule } from './grocery/grocery.module';

@Module({
  imports: [UsersModule, MongooseModule.forRoot(config.get().DATABASE_URL), GroceryModule],
  controllers: [AppController, GroceryController],
  providers: [AppService, GroceryService],
})
export class AppModule {}
