import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entites/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Grocery, GroceryDocument } from '../grocery/entities/grocery.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Grocery.name) private groceryModel: Model<GroceryDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, grocery } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const groceryDb = await this.groceryModel.findOne({ _id: grocery });
    if (!groceryDb) {
      throw new BadRequestException('Node not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }
}

