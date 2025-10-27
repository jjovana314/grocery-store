import { Grocery } from "../entities/grocery.entity";

export interface GroceryInterface {
    id: string;
    name: string;
    type: string;
    parent: Grocery | null;
}

export interface Groceries {
    groceries: GroceryInterface[];
}