import { Injectable, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entites/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GroceryService } from 'src/grocery/grocery.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly groceryService: GroceryService) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, grocery } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const groceryDb = await this.groceryService.getGrocery(grocery);
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

  async updateUser(id: string, updateId: string, request: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    // check user grocery hierachy
    const newGrocery = await this.groceryService.getGrocery(request.grocery);
    if (!newGrocery) {
      throw new NotFoundException('Grocery not found');
    }
    if (await this.canUpdateUser(user.grocery.id, newGrocery.id)) {
      const userForUpdate = await this.userModel.findById(updateId);
      if (!userForUpdate) {
        throw new NotFoundException(`User with ID ${updateId} not found`)
      }
      await this.updateUserData(user, request);
      user.save();
      return user;
    } else {
      throw new ForbiddenException(`User of type ${user.type} is not allowed to update`)
    }
  }

  private async canUpdateUser(currentUserGroceryId: string, targetGroceryId: string): Promise<boolean> {
    if (currentUserGroceryId === targetGroceryId) return true;

    const parents = await this.groceryService.getParents(targetGroceryId);
    const parentIds = parents.groceries.map(g => g.id);
    return parentIds.includes(currentUserGroceryId);
  }

  private async updateUserData(user: User, request: UpdateUserDto) {
    if (request.email) {
      user.email = request.email;
    }
    if (request.firstName) {
      user.firstName = request.firstName;
    }
    if (request.lastName) {
      user.lastName = request.lastName;
    }
    if (request.type) {
      user.lastName = request.lastName;
    }
    if (request.password) {
      user.password = await bcrypt.hash(request.password, 10);
    }
  }
}

