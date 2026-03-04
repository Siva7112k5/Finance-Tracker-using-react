import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionList from './TransactionList';
import { TRANSACTION_TYPES } from '../../utils/constants';

describe('TransactionList Component', ()) => {
  const mockTransactions = [
    {
      id: 1,
      text: 'Salary',
      amount: 5000,
      type: TRANSACTION_TYPES.INCOME,
      category: 'salary',
      date: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      text: 'Rent',
      amount: 1500,
      type: TRANSACTION_TYPES.EXPENSE,
      category: 'rent',
      date: '2024-01-01T10:00:00Z'
    },
    {
      id: 3,
      text: 'Groceries',
      amount: 200,
      type: TRANSACTION_TYPES.EXPENSE,
      category: 'food',
      date: '2024-01-10T10:00:00Z'
    }
  ];

  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnEdit.mockClear();
  });

  test('renders transaction list with items', () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  test('displays correct statistics', () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Total income: 5000
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    // Total expenses: 1700
    expect(screen.getByText('$1,700.00')).toBeInTheDocument();
  });

  test('filters by transaction type', async () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const filterSelect = screen.getByLabelText('Filter by type');
    fireEvent.change(filterSelect, { target: { value: TRANSACTION_TYPES.INCOME } });

    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.queryByText('Rent')).not.toBeInTheDocument();
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });
  });

  test('filters by category', async () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const categorySelect = screen.getByLabelText('Filter by category');
    fireEvent.change(categorySelect, { target: { value: 'food' } });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.queryByText('Salary')).not.toBeInTheDocument();
      expect(screen.queryByText('Rent')).not.toBeInTheDocument();
    });
  });

  test('searches transactions', async () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const searchInput = screen.getByPlaceholderText('🔍 Search transactions...');
    await userEvent.type(searchInput, 'rent');

    await waitFor(() => {
      expect(screen.getByText('Rent')).toBeInTheDocument();
      expect(screen.queryByText('Salary')).not.toBeInTheDocument();
      expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    });
  });

  test('sorts transactions', async () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const sortSelect = screen.getByLabelText('Sort by');
    fireEvent.change(sortSelect, { target: { value: 'amount_desc' } });

    const amounts = screen.getAllByText(/\$[\d,]+\.\d{2}/);
    expect(amounts[0]).toHaveTextContent('$5,000.00');
  });

  test('handles delete with confirmation', async () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Delete transaction');
    fireEvent.click(deleteButtons[0]);

    // First click shows confirmation
    expect(screen.getByLabelText('Click again to confirm')).toBeInTheDocument();

    // Second click triggers delete
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('handles edit click', () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButtons = screen.getAllByLabelText('Edit transaction');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTransactions[0]);
  });

  test('expands transaction details on click', () => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const transaction = screen.getByText('Salary').closest('.transaction-item');
    fireEvent.click(transaction);

    expect(screen.getByText('Transaction ID:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('clears all filters', async ()) => {
    render(
      <TransactionList 
        transactions={mockTransactions} 
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    // Apply some filters
    const filterSelect = screen.getByLabelText('Filter by type');
    fireEvent.change(filterSelect, { target: { value: TRANSACTION_TYPES.INCOME } });

    const searchInput = screen.getByPlaceholderText('🔍 Search transactions...');
    await userEvent.type(searchInput, 'salary');

    // Clear filters
    const clearBtn = screen.getByText('✕ Clear Filters');
    fireEvent.click(clearBtn);

    // All transactions should be visible
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Gro')).toBeInTheDocument();}}