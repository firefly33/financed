import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseForm } from './ExpenseForm';

describe('ExpenseForm', () => {
  it('renders the form with all fields', () => {
    const mockSubmit = vi.fn();
    render(<ExpenseForm userId="user-123" onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add expense/i })).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm userId="user-123" onSubmit={mockSubmit} />);

    const amountInput = screen.getByLabelText(/amount/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const categoryInput = screen.getByLabelText(/category/i);
    const submitButton = screen.getByRole('button', { name: /add expense/i });

    await user.type(amountInput, '50.00');
    await user.type(descriptionInput, 'Groceries');
    await user.type(categoryInput, 'Food');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          description: 'Groceries',
          category: 'Food',
          userId: 'user-123',
        })
      );
    });
  });

  it('clears the form after successful submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm userId="user-123" onSubmit={mockSubmit} />);

    const amountInput = screen.getByLabelText(/amount/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLInputElement;
    const categoryInput = screen.getByLabelText(/category/i) as HTMLInputElement;

    await user.type(amountInput, '50.00');
    await user.type(descriptionInput, 'Groceries');
    await user.type(categoryInput, 'Food');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    await waitFor(() => {
      expect(amountInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
      expect(categoryInput.value).toBe('');
    });
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<ExpenseForm userId="user-123" onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText(/amount/i), '50.00');
    await user.type(screen.getByLabelText(/description/i), 'Groceries');
    await user.type(screen.getByLabelText(/category/i), 'Food');

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /adding/i })).toBeDisabled();
  });
});
