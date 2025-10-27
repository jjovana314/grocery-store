import { Controller, Get, Query } from '@nestjs/common';
import { Grocery } from './entities/grocery.entity';
import { Groceries } from './interfaces/grocery.interface';
import { GroceryService } from './grocery.service';

@Controller('grocery')
export class GroceryController {
    constructor(private readonly groceryService: GroceryService) {}
    @Get()
    async getGroceries(@Query() type: string, name: string): Promise<Groceries> {
        return await this.groceryService.find({ type, name });
    }
}
