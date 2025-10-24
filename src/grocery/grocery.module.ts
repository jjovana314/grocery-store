import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Grocery, GrocerySchema } from './entities/grocery.entity';

@Module({
    imports: [MongooseModule.forFeature([{ name: Grocery.name, schema: GrocerySchema }])],
})
export class GroceryModule {}
