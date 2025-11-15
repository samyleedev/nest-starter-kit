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
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';

@Controller('users')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get logged-in user ("See my informations")' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Get('/me')
  async getMe(@Req() req): Promise<UserResponseDto> {
    const user = await this.userService.findOne(req.user.sub);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update logged-in user ("Update my informations")' })
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
    return plainToInstance(UserResponseDto, userUpdated, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Remove logged-in user ("Delete my account")' })
  @ApiBearerAuth()
  @Delete('/me')
  async deleteMyAccount(@Req() req): Promise<void> {
    await this.userService.delete(req.user.sub);
  }

  @ApiOperation({
    summary: 'Create new user (ADMIN access only)',
  })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Find all users (ADMIN access only)',
    description:
      'Possibility of filtering, sorting and search with query params. Paginated results.',
  })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiBearerAuth()
  @Get()
  @Roles(UserRole.ADMIN)
  async findAllUsers(
    @Query() userQueryParamsDto: UserQueryParamsDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return await this.userService.findAll(userQueryParamsDto);
  }

  @ApiOperation({
    summary: 'Find one user by id (ADMIN access only)',
  })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: UUID,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Update one user by id (ADMIN access only)',
  })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(id, updateUserDto, true);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({
    summary: 'Delete one user by id (ADMIN access only)',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id', ParseUUIDPipe) id: UUID): Promise<void> {
    await this.userService.delete(id);
  }
}
