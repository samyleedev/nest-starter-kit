import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@Req() req): Promise<User> {
    return await this.userService.findOne(req.user.sub);
  }

  @Patch('/me')
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    return await this.userService.update(req.user.sub, updateUserDto);
  }

  @Delete('/me')
  async deleteMyAccount(@Req() req): Promise<void> {
    await this.userService.delete(req.user.sub);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOneUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete(id);
  }
}
