import React, { useState, useMemo } from 'react';
import TransactionItem from './TransactionItem';
import { TRANSACTION_TYPES, SORT_OPTIONS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import './TransactionList.css';

const TransactionList = ({ transactions = [], onDelete, onEdit }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DATE_DESC);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Get unique categories from transactions
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category || 'other'));
    return ['all', ...Array.from(cats)];
  }, [transactions]);

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => (t.category || 'other') === selectedCategory);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.text.toLowerCase().includes(term) ||
        (t.category || '').toLowerCase().includes(term) ||
        formatCurrency(t.amount).includes(term)
      );
    }

    // Apply date range
    if (dateRange.start) {
      filtered = filtered.filter(t => new Date(t.date) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter(t => new Date(t.date) <= new Date(dateRange.end));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { field, order } = sortBy;
      
      if (field === 'date') {
        return order === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      
      if (field === 'amount') {
        return order === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      
      if (field === 'text') {
        return order === 'desc'
          ? b.text.localeCompare(a.text)
          : a.text.localeCompare(b.text);
      }
      
      return 0;
    });

    return filtered;
  }, [transactions, filter, sortBy, searchTerm, selectedCategory, dateRange]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = processedTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

  // Calculate statistics
  const stats = useMemo(() => {
    const visibleTotal = processedTransactions.reduce((sum, t) => 
      t.type === TRANSACTION_TYPES.INCOME ? sum + t.amount : sum - t.amount, 0
    );
    
    const visibleIncome = processedTransactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const visibleExpenses = processedTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      total: visibleTotal,
      income: visibleIncome,
      expenses: visibleExpenses,
      count: processedTransactions.length
    };
  }, [processedTransactions]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const selected = Object.values(SORT_OPTIONS).find(
      opt => `${opt.field}_${opt.order}` === e.target.value
    );
    setSortBy(selected);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({ ...prev, [type]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setSelectedCategory('all');
    setDateRange({ start: '', end: '' });
    setSortBy(SORT_OPTIONS.DATE_DESC);
    setCurrentPage(1);
  };

  const exportVisible = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      filters: { filter, searchTerm, selectedCategory, dateRange, sortBy },
      stats,
      transactions: processedTransactions
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="transaction-list-container">
      {/* Header with Stats */}
      <div className="list-header">
        <h2>Transactions</h2>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-label">Showing:</span>
            <span className="stat-value">{processedTransactions.length}</span>
          </div>
          {stats.count > 0 && (
            <>
              <div className="stat-badge income">
                <span className="stat-label">Income:</span>
                <span className="stat-value">{formatCurrency(stats.income)}</span>
              </div>
              <div className="stat-badge expense">
                <span className="stat-label">Expenses:</span>
                <span className="stat-value">{formatCurrency(stats.expenses)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search transactions..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select 
            value={filter} 
            onChange={(e) => handleFilterChange(e.target.value)}
            className="filter-select"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value={TRANSACTION_TYPES.INCOME}>Income Only</option>
            <option value={TRANSACTION_TYPES.EXPENSE}>Expenses Only</option>
          </select>

          <select 
            value={selectedCategory} 
            onChange={handleCategoryChange}
            className="filter-select"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select 
            onChange={handleSortChange}
            value={`${sortBy.field}_${sortBy.order}`}
            className="filter-select"
            aria-label="Sort by"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
            <option value="text_asc">Name A-Z</option>
            <option value="text_desc">Name Z-A</option>
          </select>
        </div>

        <div className="date-range">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="date-input"
            placeholder="Start date"
          />
          <span className="date-separator">→</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="date-input"
            placeholder="End date"
          />
        </div>

        <div className="filter-actions">
          {(filter !== 'all' || searchTerm || selectedCategory !== 'all' || 
            dateRange.start || dateRange.end) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              ✕ Clear Filters
            </button>
          )}
          <button onClick={exportVisible} className="export-list-btn">
            📥 Export
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {currentTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No transactions found</h3>
          <p>Try adjusting your filters or add a new transaction</p>
        </div>
      ) : (
        <>
          <ul className="transaction-list">
            {currentTransactions.map(transaction => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ← Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, first, last, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="page-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;