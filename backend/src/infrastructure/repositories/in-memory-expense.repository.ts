import { Injectable } from '@nestjs/common';
import { IExpenseRepository } from '../../domain/ports/expense.repository.interface';
import { Expense } from '../../domain/entities/expense.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class InMemoryExpenseRepository implements IExpenseRepository {
  private expenses: Expense[] = [];

  async findAll(userId: string): Promise<Expense[]> {
    return this.expenses.filter((expense) => expense.userId === userId);
  }

  async findById(id: string): Promise<Expense | null> {
    return this.expenses.find((expense) => expense.id === id) || null;
  }

  async findByMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<Expense[]> {
    return this.expenses.filter(
      (expense) =>
        expense.userId === userId &&
        expense.date.getMonth() + 1 === month &&
        expense.date.getFullYear() === year,
    );
  }

  async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const newExpense = new Expense(
      randomUUID(),
      expense.amount,
      expense.description,
      expense.category,
      expense.date,
      expense.userId,
    );
    this.expenses.push(newExpense);
    return newExpense;
  }

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    const index = this.expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    const updated = new Expense(
      id,
      expense.amount ?? this.expenses[index].amount,
      expense.description ?? this.expenses[index].description,
      expense.category ?? this.expenses[index].category,
      expense.date ?? this.expenses[index].date,
      expense.userId ?? this.expenses[index].userId,
    );
    this.expenses[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.expenses = this.expenses.filter((expense) => expense.id !== id);
  }
}
