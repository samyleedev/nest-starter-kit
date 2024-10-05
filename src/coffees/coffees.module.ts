import { Module } from '@nestjs/common';
import { CoffeesController } from './controllers/coffees/coffees.controller';
import { CoffeesService } from './services/coffees/coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from 'src/entities/Coffee';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
