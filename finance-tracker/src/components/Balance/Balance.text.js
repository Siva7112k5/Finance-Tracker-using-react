import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Balance from './Balance';

// Cleanup after each test
afterEach(cleanup);

describe('Balance Component', () => {
  // Test 1: Basic rendering
  test('renders balance component with title', () => {
    render(<Balance total={1000} />);
    
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  // Test 2: Positive balance styling
  test('applies positive class when balance is greater than 0', () => {
    render(<Balance total={500} />);
    
    const balanceElement = screen.getByText('$500.00');
    expect(balanceElement).toHaveClass('balance-amount');
    expect(balanceElement).toHaveClass('positive');
    expect(balanceElement).not.toHaveClass('negative');
  });

  // Test 3: Negative balance styling
  test('applies negative class when balance is less than 0', () => {
    render(<Balance total={-250} />);
    
    const balanceElement = screen.getByText('-$250.00');
    expect(balanceElement).toHaveClass('balance-amount');
    expect(balanceElement).toHaveClass('negative');
    expect(balanceElement).not.toHaveClass('positive');
  });

  // Test 4: Zero balance
  test('handles zero balance correctly', () => {
    render(<Balance total={0} />);
    
    const balanceElement = screen.getByText('$0.00');
    expect(balanceElement).toBeInTheDocument();
    expect(balanceElement).toHaveClass('positive'); // Zero is typically treated as positive
  });

  // Test 5: Large number formatting
  test('formats large numbers with commas', () => {
    render(<Balance total={1000000} />);
    
    expect(screen.getByText('$1,000,000.00')).toBeInTheDocument();
  });

  // Test 6: Decimal formatting
  test('formats decimal numbers correctly', () => {
    render(<Balance total={1234.56} />);
    
    expect(screen.getByText('$1,234.56')).toBeInTheDocument();
  });

  // Test 7: Negative decimal formatting
  test('formats negative decimal numbers correctly', () => {
    render(<Balance total={-1234.56} />);
    
    expect(screen.getByText('-$1,234.56')).toBeInTheDocument();
  });

  // Test 8: Custom className prop
  test('accepts and applies custom className', () => {
    render(<Balance total={100} className="custom-balance" />);
    
    const container = screen.getByTestId('balance-container');
    expect(container).toHaveClass('balance-container');
    expect(container).toHaveClass('custom-balance');
  });

  // Test 9: Loading state
  test('shows loading spinner when isLoading is true', () => {
    render(<Balance total={100} isLoading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
  });

  // Test 10: Income and expense breakdown
  test('displays income and expense breakdown when provided', () => {
    render(
      <Balance 
        total={500} 
        income={1500} 
        expenses={1000} 
        showBreakdown={true}
      />
    );
    
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
  });

  // Test 11: Hide breakdown
  test('hides breakdown when showBreakdown is false', () => {
    render(
      <Balance 
        total={500} 
        income={1500} 
        expenses={1000} 
        showBreakdown={false}
      />
    );
    
    expect(screen.queryByText('Income')).not.toBeInTheDocument();
    expect(screen.queryByText('Expenses')).not.toBeInTheDocument();
  });

  // Test 12: Currency symbol customization
  test('uses custom currency symbol when provided', () => {
    render(<Balance total={100} currencySymbol="€" />);
    
    expect(screen.getByText('€100.00')).toBeInTheDocument();
  });

  // Test 13: Accessibility - ARIA labels
  test('has correct ARIA attributes for accessibility', () => {
    render(<Balance total={100} />);
    
    const container = screen.getByTestId('balance-container');
    expect(container).toHaveAttribute('aria-label', 'Current balance: $100.00');
    
    const balanceElement = screen.getByText('$100.00');
    expect(balanceElement).toHaveAttribute('aria-live', 'polite');
  });

  // Test 14: Compact mode
  test('renders in compact mode when compact prop is true', () => {
    render(<Balance total={100} compact={true} />);
    
    const container = screen.getByTestId('balance-container');
    expect(container).toHaveClass('balance-container');
    expect(container).toHaveClass('compact');
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.queryByText('Current Balance')).not.toBeInTheDocument();
  });

  // Test 15: Animation on value change
  test('triggers animation class when value changes', () => {
    const { rerender } = render(<Balance total={100} />);
    
    const balanceElement = screen.getByText('$100.00');
    expect(balanceElement).not.toHaveClass('value-changed');
    
    // Update value
    rerender(<Balance total={200} />);
    
    // Should have animation class temporarily
    expect(screen.getByText('$200.00')).toHaveClass('value-changed');
  });

  // Test 16: Error boundary fallback
  test('shows error fallback when error prop is true', () => {
    render(<Balance total={100} error={true} />);
    
    expect(screen.getByText('Unable to load balance')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  // Test 17: Snapshot test
  test('matches snapshot with positive balance', () => {
    const { container } = render(<Balance total={1000} />);
    expect(container).toMatchSnapshot();
  });

  // Test 18: Snapshot test with negative balance
  test('matches snapshot with negative balance', () => {
    const { container } = render(<Balance total={-500} />);
    expect(container).toMatchSnapshot();
  });

  // Test 19: Renders with custom test ID
  test('accepts custom test ID', () => {
    render(<Balance total={100} testId="custom-balance" />);
    
    expect(screen.getByTestId('custom-balance')).toBeInTheDocument();
  });

  // Test 20: Handles undefined total gracefully
  test('handles undefined total gracefully', () => {
    render(<Balance total={undefined} />);
    
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});

// Integration Tests
describe('Balance Component Integration', () => {
  test('updates when total prop changes', () => {
    const { rerender } = render(<Balance total={100} />);
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    
    rerender(<Balance total={200} />);
    
    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
  });

  test('maintains positive class when balance becomes zero', () => {
    const { rerender } = render(<Balance total={100} />);
    
    expect(screen.getByText('$100.00')).toHaveClass('positive');
    
    rerender(<Balance total={0} />);
    
    expect(screen.getByText('$0.00')).toHaveClass('positive');
  });

  test('switches classes correctly when balance changes sign', () => {
    const { rerender } = render(<Balance total={100} />);
    
    expect(screen.getByText('$100.00')).toHaveClass('positive');
    expect(screen.getByText('$100.00')).not.toHaveClass('negative');
    
    rerender(<Balance total={-50} />);
    
    expect(screen.getByText('-$50.00')).toHaveClass('negative');
    expect(screen.getByText('-$50.00')).not.toHaveClass('positive');
  });
});
