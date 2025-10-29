import { User } from "../entites/users.entity";

export interface UsersResult {
    users: User[]; 
    total: number;
    page: number;
    limit: number
}