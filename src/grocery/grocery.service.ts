import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Grocery, GroceryDocument } from './entities/grocery.entity';
import { Model } from 'mongoose';
import { Groceries } from './interfaces/grocery.interface';

@Injectable()
export class GroceryService {
    constructor(@InjectModel(Grocery.name) private groceryModel: Model<GroceryDocument>) { }

    async getAllGroceries(type?: string): Promise<Groceries> {
        const query: any = {};
        if (type) {
            query.type = type;
        }
        const groceries = await this.groceryModel.find(query);
        if (!groceries) {
            throw new NotFoundException('Groceries not found');
        }
        return { groceries };

    }

    async getGrocery(id: string): Promise<Grocery | null> {
        return await this.groceryModel.findById(id);
    }
}
