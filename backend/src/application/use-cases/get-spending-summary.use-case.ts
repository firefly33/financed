import { Inject, Injectable } from '@nestjs/common';
import type { IExpenseRepository } from '../../domain/ports/expense.repository.interface';
import { EXPENSE_REPOSITORY } from '../../domain/ports/expense.repository.interface';
import type { ISpendingLimitRepository } from '../../domain/ports/spending-limit.repository.interface';
import { SPENDING_LIMIT_REPOSITORY } from '../../domain/ports/spending-limit.repository.interface';

export interface SpendingSummary {
  totalSpent: number;
  spendingLimit: number | null;
  remainingBudget: number | null;
  percentageUsed: number | null;
}

@Injectable()
export class GetSpendingSummaryUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: IExpenseRepository,
    @Inject(SPENDING_LIMIT_REPOSITORY)
    private readonly spendingLimitRepository: ISpendingLimitRepository,
  ) {}

  async execute(
    userId: string,
    month: number,
    year: number,
  ): Promise<SpendingSummary> {
    const expenses = await this.expenseRepository.findByMonth(
      userId,
      month,
      year,
    );
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const limit = await this.spendingLimitRepository.findByUserAndMonth(
      userId,
      month,
      year,
    );

    if (!limit) {
      return {
        totalSpent,
        spendingLimit: null,
        remainingBudget: null,
        percentageUsed: null,
      };
    }

    const remainingBudget = limit.monthlyLimit - totalSpent;
    const percentageUsed = (totalSpent / limit.monthlyLimit) * 100;

    return {
      totalSpent,
      spendingLimit: limit.monthlyLimit,
      remainingBudget,
      percentageUsed,
    };
  }
}
