import { Inject, Injectable } from '@nestjs/common';
import type { IExpenseRepository } from '../../domain/ports/expense.repository.interface';
import { EXPENSE_REPOSITORY } from '../../domain/ports/expense.repository.interface';
import { Expense } from '../../domain/entities/expense.entity';

export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: string;
  date: Date;
  userId: string;
}

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(dto: CreateExpenseDto): Promise<Expense> {
    return this.expenseRepository.create(dto);
  }
}
