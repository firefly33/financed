import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateExpenseUseCase } from '../../../application/use-cases/create-expense.use-case';
import { GetMonthlyExpensesUseCase } from '../../../application/use-cases/get-monthly-expenses.use-case';
import { GetSpendingSummaryUseCase } from '../../../application/use-cases/get-spending-summary.use-case';

@Controller('expenses')
export class ExpenseController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly getMonthlyExpensesUseCase: GetMonthlyExpensesUseCase,
    private readonly getSpendingSummaryUseCase: GetSpendingSummaryUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    createExpenseDto: {
      amount: number;
      description: string;
      category: string;
      date: string;
      userId: string;
    },
  ) {
    return this.createExpenseUseCase.execute({
      ...createExpenseDto,
      date: new Date(createExpenseDto.date),
    });
  }

  @Get()
  async getMonthly(
    @Query('userId') userId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.getMonthlyExpensesUseCase.execute(userId, month, year);
  }

  @Get('summary')
  async getSummary(
    @Query('userId') userId: string,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return this.getSpendingSummaryUseCase.execute(userId, month, year);
  }
}
