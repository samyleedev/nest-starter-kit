import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserSortableFields } from 'src/common/enums/user-sortable-fields.enum';
import { SortOrder } from 'src/common/enums/sort-order.enum';

export class UserQueryParamsDto {
  @ApiPropertyOptional({
    description: 'Page number (pagination)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of elements per page (pagination)',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Filter by user role',
    example: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: "Search by user's username or email" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: UserSortableFields,
    description: 'Sort users by sortable fields',
    default: UserSortableFields.created_at,
    example: UserSortableFields.created_at,
  })
  @IsOptional()
  @IsEnum(UserSortableFields)
  sortBy?: UserSortableFields = UserSortableFields.created_at;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order',
    default: SortOrder.DESC,
  })
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}
