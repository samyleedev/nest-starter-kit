import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';

describe('CoffeeController', () => {
  let controller: CoffeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoffeeController],
      providers: [
        {
          provide: CoffeeService,
          useValue: {
            findAll: jest.fn(() => []),
            findOne: jest.fn((id) => ({ id, name: 'Test Coffee' })),
            create: jest.fn((dto) => ({ id: 1, ...dto })),
            update: jest.fn((id, dto) => ({ id, ...dto })),
            delete: jest.fn((id) => ({ id })),
          },
        },
      ],
    }).compile();

    controller = module.get<CoffeeController>(CoffeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
