import { Injectable, ConflictException, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entites/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GroceryService } from 'src/grocery/grocery.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchUsers } from './dto/search.users';
import { UsersResult } from './interfaces/users-result-interface';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly groceryService: GroceryService, private readonly logger: PinoLogger) { }

  async findUsers(currUserId: string, query: SearchUsers): Promise<UsersResult> {
    const currentUser = await this.userModel.findById(currUserId).populate('grocery');
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const skip = (page - 1) * limit;

    const sortField = query.sort || 'createdAt';
    const sortDir = query.sortDir === 'desc' ? -1 : 1;

    const descendants = await this.groceryService.getChildren(currentUser.grocery.id);
    const allowedGroceryIds = [currentUser.grocery.id, ...descendants.map((g) => g.id)];

    // build query
    const filter: any = {
      'grocery': { $in: allowedGroceryIds },
    };

    if (currentUser.type === 'employee') {
      filter.type = 'employee';
    }

    if (query.type) {
      filter.type = query.type;
    }
    if (query.email) {
      filter.email = new RegExp(query.email, 'i');
    }
    if (query.firstName) {
      filter.firstName = new RegExp(query.firstName, 'i');
    }
    if (query.lastName) {
      filter.lastName = new RegExp(query.lastName, 'i');
    }

    const [users, total] = await Promise.all([
      this.userModel.find(filter).sort({ [sortField]: sortDir }).skip(skip).limit(limit).populate('grocery'),
      this.userModel.countDocuments(filter),
    ]);

    return { users, total, page, limit };
  }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.info(`Creating user with data ${JSON.stringify(createUserDto, null, 2)}`);
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


    const userData = await user.save();
    this.logger.info(`User with ID ${userData.id} created`);
    return userData;
  }

  async getUser(currUserId: string, id: string): Promise<User> {
    const currentUser = await this.userModel.findById(currUserId).populate('grocery');
    const targetUser = await this.userModel.findById(id).populate('grocery');

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    const canView = await this.canViewUser(currentUser, targetUser);

    if (!canView) {
      throw new ForbiddenException('You do not have permission to view this user');
    }

    return targetUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  private async canViewUser(currentUser: User, targetUser: User): Promise<boolean> {

    if (currentUser.id === targetUser.id) return true;

    const descendants = await this.groceryService.getChildren(currentUser.grocery.id);
    const descendantIds = descendants.map((g) => g.id);

    const sameOrDescendent = currentUser.grocery.id === targetUser.grocery.id || descendantIds.includes(targetUser.grocery.id);

    if (currentUser.type === 'manager') {
      return sameOrDescendent;
    }
    if (currentUser.type === 'employee') {
      return sameOrDescendent && targetUser.type === 'employee';
    }

    return false;
  }

  async updateUser(id: string, updateId: string, request: UpdateUserDto): Promise<User> {
    this.logger.info(`Trying to update user with id ${updateId} , update data ${JSON.stringify(request)}...`);
    const { currentUser, user } = await this.validate(id, updateId);
    let groceryId: string = '';

    // check user grocery hierachy
    if (request.grocery) {
      const newGrocery = await this.groceryService.getGrocery(request.grocery);
      if (!newGrocery) {
        throw new NotFoundException('Grocery not found');
      }
      groceryId = newGrocery.id;
    } else {
      groceryId = user.grocery.id;
    }

    if (await this.canUpdateUser(currentUser.grocery.id, groceryId)) {
      await this.updateUserData(user, request);
      await user.save();
      this.logger.info(`User with id ${updateId} updated`);
      return user;
    }
    throw new ForbiddenException(`User of type ${user.type} and id ${user.id} is not allowed to update`)
  }

  private async canUpdateUser(currentUserGroceryId: string, targetGroceryId: string): Promise<boolean> {
    if (currentUserGroceryId === targetGroceryId) return true;

    const parents = await this.groceryService.getParents(targetGroceryId);
    const parentIds = parents.groceries.map(g => g.id);
    return parentIds.includes(currentUserGroceryId);
  }

  private async validate(currUserId: string, userId: string): Promise<any> {
    const currentUser = await this.userModel.findById(currUserId);
    const user = await this.userModel.findById(userId);
    if (!currentUser) {
      throw new NotFoundException(`User with ID ${currUserId} not found`)
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }
    return { currentUser, user };
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
      user.type = request.type;
    }
    if (request.password) {
      user.password = await bcrypt.hash(request.password, 10);
    }
  }

  async deleteUser(currentUserId: string, id: string): Promise<User> {
    const { currentUser, user } = await this.validate(currentUserId, id);
    if (await this.canUpdateUser(currentUser.grocery.id, user.grocery.id)) {
      await user.delete();
      return user;
    }
    throw new ForbiddenException(`Cannot delete user with ID ${user.id}`);
  }

  async deleteAllUsers() {
    const result = await this.userModel.deleteMany();
    return result.deletedCount;
  }
}

