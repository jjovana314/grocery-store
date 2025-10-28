import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GroceryType } from '../grocery/entities/grocery.entity';
import { UserType } from '../users/entites/users.entity';
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
    await this.userService.deleteAllUsers();
    this.logger.info('Cleared existing data.');

    const groceryMap = new Map<string, string>();

    for (const grocery of groceriesData) {
      const parentId: string | undefined = grocery.parent ? groceryMap.get(grocery.parent) : undefined;

      this.logger.info(`Grocery data ${JSON.stringify(grocery)}`);
      this.logger.info(JSON.stringify(GroceryType[grocery.type]))

      const newGrocery = await this.groceryService.createGrocery({
        name: grocery.name,
        type: grocery.type,
        parent: parentId,
      });
      this.logger.info(`Grocery id ${newGrocery.id}`);
      groceryMap.set(grocery.name, newGrocery.id);
    }

    this.logger.info('Created grocery hierarchy.');

    for (const user of usersData) {
      const groceryId = groceryMap.get(user.grocery);

      if (!groceryId) {
        this.logger.warn(`Skipping user ${user.email} — grocery "${user.grocery}" not found.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      this.logger.info(`User data ${JSON.stringify(user)}`);
      this.logger.info(UserType[user.type]);

      await this.userService.createUser({
        ...user,
        type: user.type,
        password: hashedPassword,
        grocery: groceryId,
      });
      this.logger.info(`Created user: ${user.email}`);

    }
    this.logger.info('Seeding complete.');
  }

}

