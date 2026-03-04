import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTransaction from './AddTransaction';

describe('AddTransaction Component', () => {
  const mockSetTransactions = jest.fn();

  beforeEach(() => {
    mockSetTransactions.mockClear();
  });

  test('renders add transaction form', () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    expect(screen.getByText('Add New Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText('Add expense')).toBeInTheDocument();
  });

  test('toggles between expense and income', () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const expenseRadio = screen.getByLabelText('💸 Expense');
    const incomeRadio = screen.getByLabelText('💰 Income');
    
    expect(expenseRadio.checked).toBe(true);
    expect(incomeRadio.checked).toBe(false);
    
    fireEvent.click(incomeRadio);
    
    expect(expenseRadio.checked).toBe(false);
    expect(incomeRadio.checked).toBe(true);
  });

  test('shows validation errors for empty fields', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const submitButton = screen.getByText('Add expense');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Amount is required')).toBeInTheDocument();
    });
    
    expect(mockSetTransactions).not.toHaveBeenCalled();
  });

  test('validates amount is positive number', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await userEvent.type(descriptionInput, 'Test Transaction');
    await userEvent.type(amountInput, '-50');
    
    const submitButton = screen.getByText('Add expense');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });
    
    expect(mockSetTransactions).not.toHaveBeenCalled();
  });

  test('adds expense transaction successfully', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    await userEvent.type(descriptionInput, 'Groceries');
    await userEvent.type(amountInput, '75.50');
    
    const submitButton = screen.getByText('Add expense');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetTransactions).toHaveBeenCalledTimes(1);
      expect(mockSetTransactions).toHaveBeenCalledWith(expect.any(Function));
    });
    
    // Check if form resets
    expect(descriptionInput.value).toBe('');
    expect(amountInput.value).toBe('');
  });

  test('adds income transaction successfully', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const incomeRadio = screen.getByLabelText('💰 Income');
    fireEvent.click(incomeRadio);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    await userEvent.type(descriptionInput, 'Salary');
    await userEvent.type(amountInput, '3000');
    
    const submitButton = screen.getByText('Add Income');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetTransactions).toHaveBeenCalledTimes(1);
      expect(mockSetTransactions).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  test('quick add buttons work correctly', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const quickAdd10 = screen.getByText('+$10');
    const amountInput = screen.getByLabelText(/amount/i);
    
    fireEvent.click(quickAdd10);
    expect(amountInput.value).toBe('10');
    
    fireEvent.click(screen.getByText('+$50'));
    expect(amountInput.value).toBe('60'); // 10 + 50
  });

  test('clears errors when user starts typing', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    // Submit empty form to trigger errors
    fireEvent.click(screen.getByText('Add expense'));
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
    
    // Start typing in description
    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.type(descriptionInput, 'Test');
    
    // Error should disappear
    expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
  });

  test('disables submit button while submitting', async () => {
    render(<AddTransaction setTransactions={mockSetTransactions} />);
    
    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/amount/i);
    
    await userEvent.type(descriptionInput, 'Test');
    await userEvent.type(amountInput, '100');
    
    const submitButton = screen.getByText('Add expense');
    fireEvent.click(submitButton);
    
    // Button should be disabled and show "Adding..."
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText('Add expense')).toBeInTheDocument();
    });
  });
});