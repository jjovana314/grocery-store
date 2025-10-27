import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { Grocery } from './entities/grocery.entity';
import { Groceries } from './interfaces/grocery.interface';
import { GroceryService } from './grocery.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserType } from 'src/users/entites/users.entity';
import { Role } from 'src/auth/role.decorator';
import { UpdateGroceryDto } from './dto/update.grocery.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('grocery')
export class GroceryController {
    constructor(private readonly groceryService: GroceryService) { }
    @Get()
    async getGroceries(@Query() type: string, name: string): Promise<Groceries> {
        return await this.groceryService.find({ type, name });
    }

    @Put(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Role(UserType.MANAGER)
    async updateGrocery(@Param('id') id: string, @Body() dto: UpdateGroceryDto): Promise<Grocery> {
        return this.groceryService.updateGrocery(id, { ...dto });
    }
}
