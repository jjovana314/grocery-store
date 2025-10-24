import { Grocery } from "../entities/grocery.entity";

export interface GroceryInterface {
    name: string;
    type: string;
    parent: Grocery | null;
}

export interface Groceries {
    groceries: GroceryInterface[];
}