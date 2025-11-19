import type { Expense, CreateExpenseDto, SpendingSummary } from '../types/expense';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ExpenseService {
  async getMonthlyExpenses(
    userId: string,
    month: number,
    year: number,
  ): Promise<Expense[]> {
    const response = await fetch(
      `${API_BASE_URL}/expenses?userId=${userId}&month=${month}&year=${year}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return response.json();
  }

  async createExpense(expense: CreateExpenseDto): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    if (!response.ok) {
      throw new Error('Failed to create expense');
    }
    return response.json();
  }

  async getSpendingSummary(
    userId: string,
    month: number,
    year: number,
  ): Promise<SpendingSummary> {
    const response = await fetch(
      `${API_BASE_URL}/expenses/summary?userId=${userId}&month=${month}&year=${year}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch spending summary');
    }
    return response.json();
  }
}

export const expenseService = new ExpenseService();
