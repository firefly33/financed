import { Inject, Injectable } from '@nestjs/common';
import type { IExpenseRepository } from '../../domain/ports/expense.repository.interface';
import { EXPENSE_REPOSITORY } from '../../domain/ports/expense.repository.interface';
import { Expense } from '../../domain/entities/expense.entity';

@Injectable()
export class GetMonthlyExpensesUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    userId: string,
    month: number,
    year: number,
  ): Promise<Expense[]> {
    return this.expenseRepository.findByMonth(userId, month, year);
  }
}
