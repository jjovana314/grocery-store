import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Grocery, GroceryDocument, GroceryType } from '../grocery/entities/grocery.entity';
import { User, UserDocument } from '../users/entites/users.entity';
import { groceriesData } from './data/groceries';
import { usersData } from './data/users';
import { PinoLogger } from 'nestjs-pino';
import { GroceryService } from 'src/grocery/grocery.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {

  constructor(
    private readonly groceryService: GroceryService,
    private readonly userService: UsersService,
    private readonly logger: PinoLogger,
  ) { }

  async runSeed() {
    await this.groceryService.deleteAllGroceries();
    this.logger.info('Cleared existing data.');

    const groceryMap = new Map<string, string>();

    for (const grocery of groceriesData) {
      const parentId: string | undefined = grocery.parent ? groceryMap.get(grocery.parent) : undefined;

      const newGrocery = await this.groceryService.createGrocery({
        name: grocery.name,
        type: GroceryType[grocery.type],
        parent: parentId,
      });
      this.logger.info(`Grocery id ${newGrocery.id}`);
      groceryMap.set(grocery.name, newGrocery.id);
    }

    this.logger.info('Created grocery hierarchy.');
    this.logger.info('Seeding complete.');
  }

}

