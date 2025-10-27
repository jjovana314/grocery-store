import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { GroceryType } from "../entities/grocery.entity";

export class UpdateGroceryDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsEnum(GroceryType)
    type?: GroceryType;

    @IsOptional()
    @IsMongoId()
    parent?: string;
}