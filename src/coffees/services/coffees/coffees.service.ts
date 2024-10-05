import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from 'src/entities/Coffee';
import { CreateCoffeeParams } from 'src/coffees/dtos/CreateCoffeeParams.dto';
import { UpdateCoffeeParamsDto } from 'src/coffees/dtos/UpdateCoffeeParams.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee) private coffeeRespository: Repository<Coffee>,
  ) {}

  async findAll(): Promise<Coffee[]> {
    try {
      return await this.coffeeRespository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Coffee> {
    try {
      return await this.coffeeRespository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async create(coffeeDetails: CreateCoffeeParams): Promise<Coffee> {
    try {
      const newUser = this.coffeeRespository.create({
        ...coffeeDetails,
        created_at: new Date(),
      });
      return await this.coffeeRespository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    coffeeDetails: UpdateCoffeeParamsDto,
  ): Promise<Coffee> {
    try {
      const results = await this.coffeeRespository.update(
        { id },
        { ...coffeeDetails },
      );
      if (!results.affected) {
        throw new Error('Coffee not found');
      }
      return await this.coffeeRespository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.coffeeRespository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
