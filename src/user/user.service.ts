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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
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

  async update(id: UUID, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(id, {
      ...updateUserDto,
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
