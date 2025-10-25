import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserType } from './entites/users.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

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
    const hashedPassword = await bcrypt.hash('password123', 10);

    userModel.save = jest.fn().mockResolvedValue({
      firstName: 'Jovana',
      lastName: 'Jovanović',
      email: 'test@example.com',
      password: hashedPassword,
      type: 'manager',
    });

    const result = await service.createUser({
      firstName: 'Jovana',
      lastName: 'Jovanovic',
      email: 'test@example.com',
      password: 'password123',
      type: UserType.MANAGER,
      grocery: '671a4444' // todo: add grocery ID here
    });

    expect(result.email).toBe('test@example.com');
    expect(result.password).not.toBe('password123');
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
        grocery: '671a4444', // todo: add grocery ID here
      }),
    ).rejects.toThrow('Email already registered');
  });
});
