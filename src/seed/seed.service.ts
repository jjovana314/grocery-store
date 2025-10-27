import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Grocery, GroceryDocument } from '../grocery/entities/grocery.entity';
import { User, UserDocument } from '../users/entites/users.entity';
import { groceriesData } from './data/groceries';
import { usersData } from './data/users';
import { PinoLogger } from 'nestjs-pino';
import { GroceryService } from 'src/grocery/grocery.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService implements OnModuleInit {

  constructor(
    private readonly groceryService: GroceryService,
    private readonly userService: UsersService,
    private readonly logger: PinoLogger,
  ) {}

  onModuleInit() {
    this.runSeed();
  }

  async runSeed() {
    // await this.groceryModel.deleteMany({});
    // await this.userModel.deleteMany({});
    // this.logger.info('Cleared existing data.');

    const groceryMap = new Map<string, string>();
    for (const grocery of groceriesData) {
      const parentId: string | undefined = grocery.parent ? groceryMap.get(grocery.parent) : undefined;
      const newGrocery = await this.groceryService.createGrocery(
        grocery.name,
        grocery.type,
        parentId,
      );
      groceryMap.set(grocery.name, newGrocery.id);
    }
    this.logger.info('Created grocery hierarchy.');

    // for (const user of usersData) {
    //   const hashed = await bcrypt.hash(user.password, 10);
    //   await this.userService.createUser({
    //     ...user,
    //     password: hashed,
    //     grocery: groceryMap.get(user.grocery),
    //   });
    // }
    // this.logger.info('Created users.');

    this.logger.info('Seeding complete.');
  }
}

