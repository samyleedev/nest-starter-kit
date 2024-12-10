import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
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
import { UUID } from 'crypto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/me')
  async getMe(@Req() req): Promise<User> {
    return await this.userService.findOne(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('/me')
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<User> {
    return await this.userService.update(req.user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('/me')
  async deleteMyAccount(@Req() req): Promise<void> {
    await this.userService.delete(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOneUser(@Param('id', ParseUUIDPipe) id: UUID): Promise<User> {
    return await this.userService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    await this.userService.delete(id);
  }
}
