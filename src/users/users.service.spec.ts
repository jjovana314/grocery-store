import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserType } from './entites/users.entity';
import * as bcrypt from 'bcrypt';
import { GroceryService } from 'src/grocery/grocery.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;
  let groceryService: any;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    userModel.findOne.mockResolvedValue(null);
    groceryService.getOneGroceryByName.mockResolvedValue({
      id: 'mockedGroceryId',
      name: 'Radnja 1',
    });
    const hashedPassword = await bcrypt.hash('password123', 10);

    userModel.save = jest.fn().mockResolvedValue({
      firstName: 'Jovana',
      lastName: 'Jovanović',
      email: 'test@example.com',
      password: hashedPassword,
      type: 'manager',
      grocery: 'mockedGroceryId',
    });

    const result = await service.createUser({
      firstName: 'Jovana',
      lastName: 'Jovanovic',
      email: 'test@example.com',
      password: 'password123',
      type: UserType.MANAGER,
      grocery: 'Radnja 1'
    });

    expect(groceryService.getOneGroceryByName).toHaveBeenCalledWith('Radnja 1');
    expect(result.email).toBe('test@example.com');
    expect(result.password).not.toBe('password123');
    expect(result.grocery).toBe('mockedGroceryId');
  });

  it('should throw ConflictException if email already exists', async () => {
    userModel.findOne.mockResolvedValue({ email: 'existing@example.com' });

    await expect(
      service.createUser({
        firstName: 'Ana',
        lastName: 'Peric',
        email: 'existing@example.com',
        password: 'secret123',
        type: UserType.EMPLOYEE,
        grocery: 'Radnja 1',
      }),
    ).rejects.toThrow('Email already registered');
  });
});
