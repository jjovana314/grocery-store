import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Grocery, GroceryDocument } from '../grocery/entities/grocery.entity';
import { User, UserDocument } from '../users/entites/users.entity';
import { groceriesData } from './data/groceries';
import { usersData } from './data/users';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Grocery.name) private groceryModel: Model<GroceryDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly logger: PinoLogger,
  ) {}

  async runSeed() {
    await this.groceryModel.deleteMany({});
    await this.userModel.deleteMany({});
    this.logger.info('Cleared existing data.');

    const groceryMap = new Map<string, string>();
    for (const grocery of groceriesData) {
      const parentId = grocery.parent ? groceryMap.get(grocery.parent) : null;
      const newGrocery = await this.groceryModel.create({
        name: grocery.name,
        type: grocery.type,
        parent: parentId,
      });
      groceryMap.set(grocery.name, newGrocery._id.toString());
    }
    this.logger.info('Created grocery hierarchy.');

    for (const user of usersData) {
      const hashed = await bcrypt.hash(user.password, 10);
      await this.userModel.create({
        ...user,
        password: hashed,
        grocery: groceryMap.get(user.grocery),
      });
    }
    this.logger.info('Created users.');

    this.logger.info('Seeding complete.');
  }
}

