import { Expense } from '../entities/expense.entity';

export interface IExpenseRepository {
  findAll(userId: string): Promise<Expense[]>;
  findById(id: string): Promise<Expense | null>;
  findByMonth(userId: string, month: number, year: number): Promise<Expense[]>;
  create(expense: Omit<Expense, 'id'>): Promise<Expense>;
  update(id: string, expense: Partial<Expense>): Promise<Expense>;
  delete(id: string): Promise<void>;
}

export const EXPENSE_REPOSITORY = Symbol('IExpenseRepository');
