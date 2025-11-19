import { Test, TestingModule } from '@nestjs/testing';
import { CreateExpenseUseCase } from './create-expense.use-case';
import {
  IExpenseRepository,
  EXPENSE_REPOSITORY,
} from '../../domain/ports/expense.repository.interface';
import { Expense } from '../../domain/entities/expense.entity';

describe('CreateExpenseUseCase', () => {
  let useCase: CreateExpenseUseCase;
  let mockRepository: jest.Mocked<IExpenseRepository>;

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByMonth: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateExpenseUseCase,
        {
          provide: EXPENSE_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateExpenseUseCase>(CreateExpenseUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create an expense successfully', async () => {
      // Arrange
      const createDto = {
        amount: 50.0,
        description: 'Groceries',
        category: 'Food',
        date: new Date('2025-01-15'),
        userId: 'user-123',
      };

      const expectedExpense = new Expense(
        'expense-1',
        createDto.amount,
        createDto.description,
        createDto.category,
        createDto.date,
        createDto.userId,
      );

      mockRepository.create.mockResolvedValue(expectedExpense);

      // Act
      const result = await useCase.execute(createDto);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedExpense);
    });
  });
});
