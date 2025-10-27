import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Grocery, GroceryDocument } from './entities/grocery.entity';
import { Model } from 'mongoose';
import { Groceries } from './interfaces/grocery.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateGroceryDto } from './dto/create.grocery.dto';
import { UpdateGroceryDto } from './dto/update.grocery.dto';

@Injectable()
export class GroceryService {
    constructor(@InjectModel(Grocery.name) private groceryModel: Model<GroceryDocument>) { }

    async find(request: { type?: string, name?: string} ): Promise<Groceries> {
        const query: any = {};
        if (request.type) {
            query.type = request.type;
        }
        if (request.name) {
            query.name = request.name;
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

    async getOneGroceryByName(name: string): Promise<Grocery | null> {
        return await this.groceryModel.findOne({ name });
    }

    async createGrocery(request: CreateGroceryDto ): Promise<Grocery> {
        return await this.groceryModel.create(request);
    }

    async deleteAllGroceries(): Promise<{ groceries: number}> {
        const groceries = await this.groceryModel.deleteMany();
        return { groceries: groceries.deletedCount };
    }

    async updateGrocery(id: string, request: UpdateGroceryDto): Promise<Grocery> {
        const grocery: Grocery | null = await this.groceryModel.findById(id);
        if (!grocery) {
            throw new NotFoundException('Grocery not found');
        }
        if (request.name) {
            grocery.name = request.name;
        }
        if (request.parent) {
            const groceryParent = await this.groceryModel.findById(request.parent);
            if (!groceryParent) {
                throw new NotFoundException('Parent grocery not found');
            }
            grocery.parent = groceryParent.id;
        }
        if (request.type) {
            grocery.type = request.type;
        }
        return grocery;
    }
}
