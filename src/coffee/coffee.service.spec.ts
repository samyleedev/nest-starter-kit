import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CoffeesService', () => {
  let service: CoffeeService;
  let repository: Repository<Coffee>;

  const mockCoffeeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        {
          provide: getRepositoryToken(Coffee),
          useValue: mockCoffeeRepository,
        },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
    repository = module.get<Repository<Coffee>>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
