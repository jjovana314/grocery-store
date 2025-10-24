import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Grocery, GrocerySchema } from './entities/grocery.entity';
import { GroceryService } from './grocery.service';
import { GroceryController } from './grocery.controller';

@Module({
    providers: [GroceryService],
    controllers: [GroceryController],
    exports: [GroceryService],
    imports: [MongooseModule.forFeature([{ name: Grocery.name, schema: GrocerySchema }])],
})
export class GroceryModule {}
