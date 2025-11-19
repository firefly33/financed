import type { Expense } from '../types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function ExpenseList({ expenses, isLoading }: ExpenseListProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="text-gray-500">No expenses found for this month.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">
        Expenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-gray-200">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-gray-200">
                Description
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-gray-200">
                Category
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700 border-b border-gray-200">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border-b border-gray-200">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">{expense.description}</td>
                <td className="px-4 py-3 border-b border-gray-200">{expense.category}</td>
                <td className="px-4 py-3 border-b border-gray-200 font-semibold">
                  ${expense.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
