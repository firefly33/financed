export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
}

export interface SpendingLimit {
  id: string;
  userId: string;
  monthlyLimit: number;
  month: number;
  year: number;
}

export interface SpendingSummary {
  totalSpent: number;
  spendingLimit: number | null;
  remainingBudget: number | null;
  percentageUsed: number | null;
}

export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
}
