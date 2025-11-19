import { Module } from '@nestjs/common';
import { EXPENSE_REPOSITORY } from './domain/ports/expense.repository.interface';
import { SPENDING_LIMIT_REPOSITORY } from './domain/ports/spending-limit.repository.interface';
import { InMemoryExpenseRepository } from './infrastructure/repositories/in-memory-expense.repository';
import { InMemorySpendingLimitRepository } from './infrastructure/repositories/in-memory-spending-limit.repository';
import { CreateExpenseUseCase } from './application/use-cases/create-expense.use-case';
import { GetMonthlyExpensesUseCase } from './application/use-cases/get-monthly-expenses.use-case';
import { GetSpendingSummaryUseCase } from './application/use-cases/get-spending-summary.use-case';
import { ExpenseController } from './infrastructure/adapters/http/expense.controller';
import { SpendingLimitController } from './infrastructure/adapters/http/spending-limit.controller';

@Module({
  controllers: [ExpenseController, SpendingLimitController],
  providers: [
    {
      provide: EXPENSE_REPOSITORY,
      useClass: InMemoryExpenseRepository,
    },
    {
      provide: SPENDING_LIMIT_REPOSITORY,
      useClass: InMemorySpendingLimitRepository,
    },
    CreateExpenseUseCase,
    GetMonthlyExpensesUseCase,
    GetSpendingSummaryUseCase,
    InMemorySpendingLimitRepository,
  ],
})
export class AppModule {}
