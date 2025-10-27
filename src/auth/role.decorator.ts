import { SetMetadata } from '@nestjs/common';
import { UserType } from '../users/entites/users.entity';

export const Role = (role: UserType) => SetMetadata('role', role);
