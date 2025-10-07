import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UUID } from 'crypto';
import { UserQueryParamsDto } from './dtos/user-query-params.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(userQueryParamsDto: UserQueryParamsDto): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 3,
      role,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = userQueryParamsDto;

    const qb = this.userRepository.createQueryBuilder('user');

    // **Filtrage**
    if (role) {
      qb.andWhere('user.roles = :role', { role });
    }

    if (search) {
      qb.andWhere('(user.username LIKE :search OR user.email LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // **Tri**
    qb.orderBy(`user.${sortBy}`, sortOrder);

    // **Pagination**
    qb.skip((page - 1) * limit).take(limit);

    // Exécute la requête
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: UUID): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, username } = createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException('Email or username already in use.');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    return await this.userRepository.save(newUser);
  }

  async update(
    id: UUID,
    updateData: Partial<User>,
    isAdmin: Boolean,
  ): Promise<User> {
    if (!isAdmin && updateData.roles) {
      delete updateData.roles;
    }
    const result = await this.userRepository.update(id, {
      ...updateData,
      updated_at: new Date(),
    });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return this.userRepository.findOne({ where: { id } });
  }

  async delete(id: UUID): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
