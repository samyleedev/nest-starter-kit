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
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Get('/me')
  async getMe(@Req() req): Promise<UserResponseDto> {
    const user = await this.userService.findOne(req.user.sub);
    return plainToInstance(UserResponseDto, user);
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Patch('/me')
  async updateMe(
    @Body() updateMeDto: UpdateMeDto,
    @Req() req,
  ): Promise<UserResponseDto> {
    const userUpdated = await this.userService.update(
      req.user.sub,
      updateMeDto,
      false,
    );
    return plainToInstance(UserResponseDto, userUpdated);
  }

  @ApiOperation({ summary: 'Delete current user' })
  @ApiBearerAuth()
  @Delete('/me')
  async deleteMyAccount(@Req() req): Promise<void> {
    await this.userService.delete(req.user.sub);
  }

  @ApiOperation({
    summary: 'Create new user',
    description: 'Accessible only to users with ADMIN role',
  })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return plainToInstance(UserResponseDto, user);
  }

  @ApiOperation({
    summary: 'Find all users',
    description: 'Accessible only to users with ADMIN role',
  })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<UserResponseDto> })
  @ApiBearerAuth()
  @Get()
  @Roles(UserRole.ADMIN)
  async findAllUsers(
    @Query() userQueryParamsDto: UserQueryParamsDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return await this.userService.findAll(userQueryParamsDto);
  }

  @ApiOperation({ summary: 'Find one user by id' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return plainToInstance(UserResponseDto, user);
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
