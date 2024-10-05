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
import { CreateCoffeeDto } from 'src/coffees/dtos/CreateCoffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dtos/UpdateCoffee.dto';
import { CoffeesService } from 'src/coffees/services/coffees/coffees.service';
import { Coffee } from 'src/entities/Coffee';

@Controller('coffees')
export class CoffeesController {
  constructor(private coffeesService: CoffeesService) {}

  @Get()
  async findAllCoffees(): Promise<Coffee[]> {
    return await this.coffeesService.findAll();
  }

  @Get(':id')
  async findOneCoffee(@Param('id', ParseIntPipe) id: number): Promise<Coffee> {
    return await this.coffeesService.findOne(id);
  }

  @Post()
  async createCoffee(
    @Body() createCoffeeDto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return await this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  async updateCoffee(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<Coffee> {
    return await this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  async deleteCoffee(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.coffeesService.delete(id);
  }
}
