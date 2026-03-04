import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Summary from './Summary';
import { TRANSACTION_TYPES } from '../../utils/constants';

describe('Summary Component', () => {
  // Mock data
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
    },
    {
      id: 4,
      text: 'Freelance',
      amount: 1000,
      type: TRANSACTION_TYPES.INCOME,
      category: 'freelance',
      date: '2024-01-20T10:00:00Z'
    }
  ];

  // Test 1: Renders summary component
  test('renders summary component with title', () => {
    render(<Summary transactions={mockTransactions} />);
    expect(screen.getByText('Financial Summary')).toBeInTheDocument();
  });

  // Test 2: Calculates totals correctly
  test('calculates and displays correct totals', () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Total balance: 5000 + 1000 - 1500 - 200 = 4300
    expect(screen.getByText('$4,300.00')).toBeInTheDocument();
    
    // Total income: 5000 + 1000 = 6000
    expect(screen.getByText('$6,000.00')).toBeInTheDocument();
    
    // Total expenses: 1500 + 200 = 1700
    expect(screen.getByText('$1,700.00')).toBeInTheDocument();
  });

  // Test 3: Calculates savings rate correctly
  test('calculates savings rate correctly', () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Savings rate: (6000 - 1700) / 6000 * 100 = 71.67%
    expect(screen.getByText('71.7%')).toBeInTheDocument();
  });

  // Test 4: Handles empty transactions
  test('handles empty transactions array', () => {
    render(<Summary transactions={[]} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  // Test 5: Toggles details section
  test('toggles details section when show more/less is clicked', async () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Details should be hidden initially
    expect(screen.queryByText('Category Breakdown')).not.toBeInTheDocument();
    
    // Click show more
    const showMoreBtn = screen.getByText('▼ Show More');
    fireEvent.click(showMoreBtn);
    
    // Details should be visible
    await waitFor(() => {
      expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
      expect(screen.getByText('Monthly Trends')).toBeInTheDocument();
    });
    
    // Click show less
    const showLessBtn = screen.getByText('▲ Show Less');
    fireEvent.click(showLessBtn);
    
    // Details should be hidden again
    await waitFor(() => {
      expect(screen.queryByText('Category Breakdown')).not.toBeInTheDocument();
    });
  });

  // Test 6: Category breakdown displays correctly
  test('displays category breakdown correctly', () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Show details
    fireEvent.click(screen.getByText('▼ Show More'));
    
    // Check income categories
    expect(screen.getByText('salary')).toBeInTheDocument();
    expect(screen.getByText('freelance')).toBeInTheDocument();
    
    // Check expense categories
    expect(screen.getByText('rent')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
  });

  // Test 7: Monthly trends display correctly
  test('displays monthly trends correctly', () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Show details
    fireEvent.click(screen.getByText('▼ Show More'));
    
    // Should show month (all transactions in Jan 2024)
    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
  });

  // Test 8: Statistics display correctly
  test('displays additional statistics correctly', () => {
    render(<Summary transactions={mockTransactions} />);
    
    // Show details
    fireEvent.click(screen.getByText('▼ Show More'));
    
    // Total transactions: 4
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Average transaction: (6000 + 1700) / 4 = 1925
    expect(screen.getByText('$1,925.00')).toBeInTheDocument();
    
    // Largest income: 5000
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    
    // Largest expense: 1500
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
  });

  // Test 9: Timeframe filter changes
  test('timeframe filter can be changed', () => {
    render(<Summary transactions={mockTransactions} />);
    
    const select = screen.getByLabelText('Select timeframe');
    fireEvent.change(select, { target: { value: 'this_week' } });
    
    expect(select.value).toBe('this_week');
  });

  // Test 10: Export functionality
  test('export button triggers download', () => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    const mockCreateObjectURL = jest.fn();
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;
    
    // Mock document.createElement
    const mockClick = jest.fn();
    const mockLink = { click: mockClick, href: '', download: '' };
    document.createElement = jest.fn().mockReturnValue(mockLink);
    
    render(<Summary transactions={mockTransactions} />);
    
    const exportBtn = screen.getByText('📥 Export');
    fireEvent.click(exportBtn);
    
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    
    // Cleanup
    delete global.URL.createObjectURL;
    delete global.URL.revokeObjectURL;
  });

  // Test 11: Summary cards click handlers
  test('summary cards are clickable when onClick provided', () => {
    const mockOnClick = jest.fn();
    
    render(
      <Summary 
        transactions={mockTransactions}
        onCardClick={mockOnClick}
      />
    );
    
    const cards = screen.getAllByRole('button');
    fireEvent.click(cards[0]);
    
    expect(mockOnClick).toHaveBeenCalled();
  });

  // Test 12: Handles single transaction
  test('handles single transaction correctly', () => {
    const singleTransaction = [mockTransactions[0]];
    
    render(<Summary transactions={singleTransaction} />);
    
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$5,000.00')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  // Test 13: Handles only expenses
  test('handles only expenses correctly', () => {
    const expensesOnly = mockTransactions.filter(
      t => t.type === TRANSACTION_TYPES.EXPENSE
    );
    
    render(<Summary transactions={expensesOnly} />);
    
    expect(screen.getByText('-$1,700.00')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen