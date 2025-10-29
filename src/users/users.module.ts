import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entites/users.entity';
import { GroceryModule } from 'src/grocery/grocery.module';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema } ]), 
    GroceryModule,
  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
