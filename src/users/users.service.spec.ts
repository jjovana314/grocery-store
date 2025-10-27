import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserType } from './entites/users.entity';
import * as bcrypt from 'bcrypt';
import { GroceryService } from '../grocery/grocery.service';

describe('UsersService', () => {
  let service: UsersService;
  let groceryService: any;
  let mockSave: jest.Mock;

  beforeEach(async () => {
    mockSave = jest.fn();

    const userModelMock: any = jest.fn().mockImplementation((data) => ({
      ...data,
      save: mockSave.mockResolvedValue({
        ...data,
        id: 'mockedUserId',
      }),
    }));

    userModelMock.findOne = jest.fn();
    userModelMock.create = jest.fn();

    groceryService = {
      getGrocery: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModelMock },
        { provide: GroceryService, useValue: groceryService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should register a new user successfully', async () => {
    const userModel: any = (service as any).userModel;
    userModel.findOne.mockResolvedValue(null);

    groceryService.getGrocery.mockResolvedValue({
      id: 'mockedGroceryId',
      name: 'Radnja 1',
    });

    const result = await service.createUser({
      firstName: 'Jovana',
      lastName: 'Jovanovic',
      email: 'test@example.com',
      password: 'password123',
      type: UserType.MANAGER,
      grocery: 'Radnja 1',
    });

    expect(groceryService.getGrocery).toHaveBeenCalledWith('Radnja 1');
    expect(mockSave).toHaveBeenCalled();
    expect(result.id).toBe('mockedUserId');
    expect(result.password).not.toBe('password123');
  });

  it('should throw ConflictException if email already exists', async () => {
    const userModel: any = (service as any).userModel;
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
