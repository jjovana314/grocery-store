import { Module } from '@nestjs/common';
import { GroceryModule } from '../grocery/grocery.module';
import { UsersModule } from '../users/users.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    GroceryModule,
    UsersModule
  ],
  providers: [SeedService],
})
export class SeedModule {}

