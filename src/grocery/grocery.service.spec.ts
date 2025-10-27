import { Test, TestingModule } from '@nestjs/testing';
import { GroceryService } from './grocery.service';
import { getModelToken } from '@nestjs/mongoose';
import { Grocery } from './entities/grocery.entity';

describe('GroceryService', () => {
  let service: GroceryService;
  let model: any;

  beforeEach(async () => {
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroceryService,
        { provide: getModelToken(Grocery.name), useValue: model },
      ],
    }).compile();

    service = module.get<GroceryService>(GroceryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

