import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { UUID } from 'crypto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { UpdateMeDto } from './dtos/update-me.dto';
import { UserQueryParamsDto } from './dtos/user-query-params.dto';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req): Promise<User> {
    return await this.userService.findOne(req.user.sub);
  }

  @Patch('/me')
  async updateMe(@Body() updateMeDto: UpdateMeDto, @Req() req): Promise<User> {
    return await this.userService.update(req.user.sub, updateMeDto, false);
  }

  @Delete('/me')
  async deleteMyAccount(@Req() req): Promise<void> {
    await this.userService.delete(req.user.sub);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async findAllUsers(
    @Query() userQueryParamsDto: UserQueryParamsDto,
  ): Promise<any> {
    return await this.userService.findAll(userQueryParamsDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOneUser(@Param('id', ParseUUIDPipe) id: UUID): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDto, true);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    await this.userService.delete(id);
  }
}
