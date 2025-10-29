import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserType } from './entites/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { SearchUsers } from './dto/search.users';
import { UsersResult } from './interfaces/users-result-interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findUsers(@Req() req: any, @Query() query: SearchUsers): Promise<UsersResult> {
    return await this.usersService.findUsers(req.user.id, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param() id: string, @Req() req) {
    return await this.usersService.getUser(req.user.id, id);

  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(createUserDto);
  }

  
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role(UserType.MANAGER)
  
  async updateUser(@Param() id: string, @Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {
    return await this.usersService.updateUser(id, req.user.id, { ...updateUserDto });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Role(UserType.MANAGER)
  async removeUser(@Param() id: string, @Req() req): Promise<User> {
    return await this.usersService.deleteUser(req.user.id, id);
  }

}

