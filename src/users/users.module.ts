import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entites/users.entity';
import { GrocerySchema, Grocery } from '../grocery/entities/grocery.entity';

@Module({
  providers: [UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Grocery.name, schema: GrocerySchema }])],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
