import { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SpendingSummary } from './components/SpendingSummary';
import { expenseService } from './services/expense.service';
import type { Expense, SpendingSummary as SpendingSummaryType } from './types/expense';
import './App.css';

function App() {
  const userId = 'user-123'; // In a real app, this would come from authentication
  const [currentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<SpendingSummaryType | null>(null);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const loadExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const data = await expenseService.getMonthlyExpenses(userId, currentMonth, currentYear);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const loadSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await expenseService.getSpendingSummary(userId, currentMonth, currentYear);
      setSummary(data);
    } catch (error) {
      console.error('Failed to load summary:', error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleCreateExpense = async (expenseData: any) => {
    await expenseService.createExpense(expenseData);
    await loadExpenses();
    await loadSummary();
  };

  useEffect(() => {
    loadExpenses();
    loadSummary();
  }, [currentMonth, currentYear]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-slate-800 text-white py-8 px-4 text-center shadow-md">
        <h1 className="text-4xl font-bold mb-2">Finance Manager</h1>
        <p className="text-slate-300">
          Tracking: {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-lg p-6 shadow-md">
            <SpendingSummary summary={summary} isLoading={isLoadingSummary} />
          </section>

          <section className="bg-white rounded-lg p-6 shadow-md">
            <ExpenseForm userId={userId} onSubmit={handleCreateExpense} />
          </section>

          <section className="md:col-span-2 bg-white rounded-lg p-6 shadow-md">
            <ExpenseList expenses={expenses} isLoading={isLoadingExpenses} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
