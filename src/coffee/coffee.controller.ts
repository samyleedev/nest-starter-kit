import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCoffeeDto } from './dtos/create-coffee.dto';
import { UpdateCoffeeDto } from './dtos/update-coffee.dto';
import { CoffeeService } from './coffee.service';
import { Coffee } from './entities/coffee.entity';

@Controller('coffees')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @Get()
  async findAllCoffees(): Promise<Coffee[]> {
    return await this.coffeeService.findAll();
  }

  @Get(':id')
  async findOneCoffee(@Param('id', ParseIntPipe) id: number): Promise<Coffee> {
    return await this.coffeeService.findOne(id);
  }

  @Post()
  async createCoffee(
    @Body() createCoffeeDto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return await this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  async updateCoffee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<Coffee> {
    return await this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  async deleteCoffee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.coffeeService.delete(id);
  }
}
