import type { SpendingSummary as SpendingSummaryType } from '../types/expense';

interface SpendingSummaryProps {
  summary: SpendingSummaryType | null;
  isLoading: boolean;
}

export function SpendingSummary({ summary, isLoading }: SpendingSummaryProps) {
  if (isLoading) {
    return <div className="text-gray-500">Loading summary...</div>;
  }

  if (!summary) {
    return <div className="text-gray-500">No summary available</div>;
  }

  const { totalSpent, spendingLimit, remainingBudget, percentageUsed } = summary;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">
        Monthly Summary
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-slate-600">Total Spent:</span>
          <strong className="text-xl text-slate-800">${totalSpent.toFixed(2)}</strong>
        </div>
        {spendingLimit !== null && (
          <>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-slate-600">Monthly Limit:</span>
              <strong className="text-xl text-slate-800">${spendingLimit.toFixed(2)}</strong>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-slate-600">Remaining Budget:</span>
              <strong
                className={`text-xl ${remainingBudget! < 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                ${remainingBudget!.toFixed(2)}
              </strong>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600">Percentage Used:</span>
              <strong
                className={`text-xl ${percentageUsed! > 100 ? 'text-red-600' : 'text-slate-800'}`}
              >
                {percentageUsed!.toFixed(1)}%
              </strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
