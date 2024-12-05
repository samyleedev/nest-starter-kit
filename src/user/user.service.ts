import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserParams } from './dtos/create-user-params.dto';
import { UpdateUserParamsDto } from './dtos/update-user-params.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async create(userDetails: CreateUserParams): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...userDetails,
        created_at: new Date(),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, userDetails: UpdateUserParamsDto): Promise<User> {
    try {
      const results = await this.userRepository.update(
        { id },
        { ...userDetails },
      );
      if (!results.affected) {
        throw new Error('User not found');
      }
      return await this.userRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.userRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
