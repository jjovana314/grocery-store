import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { GroceryType } from "../entities/grocery.entity";

export class CreateGroceryDto {
    @IsNotEmpty()
    name: string;

    @IsEnum(GroceryType)
    type: GroceryType;

    @IsOptional()
    @IsMongoId()
    parent?: string;
}