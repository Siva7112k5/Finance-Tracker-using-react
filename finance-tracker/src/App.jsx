import React, { useState, useEffect, lazy, Suspense } from 'react';
import Balance from './components/Balance/Balance';
import TransactionList from './components/TransactionList/TransactionList';
import AddTransaction from './components/AddTransaction/AddTransaction';
import Summary from './components/Summary/Summary';
import { Button, Card, LoadingSpinner } from './components/UI';
import useLocalStorage from './hooks/useLocalStorage';
import useTheme from './hooks/useTheme';
import { TRANSACTION_TYPES, STORAGE_KEYS, MESSAGES } from './utils/constants';
import { calculateTotals } from './utils/calculations';
import './App.css';

// Lazy load less critical components
const Analytics = lazy(() => import('./components/Analytics/Analytics'));
const Settings = lazy(() => import('./components/Settings/Settings'));
const ExportData = lazy(() => import('./components/ExportData/ExportData'));

function App() {
  // =========================================================================
  // State Management
  // =========================================================================
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.TRANSACTIONS, []);
  const [view, setView] = useState('dashboard'); // dashboard, analytics, settings
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Custom hooks
  const { theme, toggleTheme, isDarkMode, colors } = useTheme();

  // =========================================================================
  // Computed Values
  // =========================================================================
  const totals = calculateTotals(transactions);
  
  const stats = {
    totalTransactions: transactions.length,
    averageTransaction: transactions.length > 0 
      ? (totals.totalIncome + totals.totalExpenses) / transactions.length 
      : 0,
    savingsRate: totals.totalIncome > 0 
      ? ((totals.totalIncome - totals.totalExpenses) / totals.totalIncome) * 100 
      : 0
  };

  // =========================================================================
  // Effects
  // =========================================================================
  useEffect(() => {
    // Simulate initial loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-hide notifications after 3 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => {
      setNotification({ type: 'success', message: 'You are back online!' });
    };
    
    const handleOffline = () => {
      setNotification({ type: 'warning', message: 'You are offline. Changes will be saved locally.' });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // =========================================================================
  // Event Handlers
  // =========================================================================
  const handleAddTransaction = (newTransaction) => {
    try {
      setTransactions(prev => [newTransaction, ...prev]);
      setNotification({
        type: 'success',
        message: MESSAGES.SUCCESS.TRANSACTION_ADDED
      });
    } catch (err) {
      setError('Failed to add transaction');
      setNotification({
        type: 'error',
        message: MESSAGES.ERROR.SAVE_FAILED
      });
    }
  };

  const handleDeleteTransaction = (id) => {
    try {
      setTransactions(prev => prev.filter(t => t.id !== id));
      setNotification({
        type: 'success',
        message: MESSAGES.SUCCESS.TRANSACTION_DELETED
      });
    } catch (err) {
      setError('Failed to delete transaction');
      setNotification({
        type: 'error',
        message: MESSAGES.ERROR.GENERIC
      });
    }
  };

  const handleEditTransaction = (updatedTransaction) => {
    try {
      setTransactions(prev => 
        prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
      );
      setSelectedTransaction(null);
      setNotification({
        type: 'success',
        message: MESSAGES.SUCCESS.TRANSACTION_UPDATED
      });
    } catch (err) {
      setError('Failed to update transaction');
      setNotification({
        type: 'error',
        message: MESSAGES.ERROR.GENERIC
      });
    }
  };

  const handleImportData = (importedTransactions) => {
    try {
      setTransactions(importedTransactions);
      setNotification({
        type: 'success',
        message: 'Data imported successfully!'
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Failed to import data'
      });
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
      setTransactions([]);
      setNotification({
        type: 'success',
        message: 'All data cleared'
      });
    }
  };

  const handleExportData = () => {
    const data = {
      transactions,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      stats
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    setNotification({
      type: 'success',
      message: 'Data exported successfully!'
    });
  };

  // =========================================================================
  // Render Methods
  // =========================================================================
  const renderNotification = () => {
    if (!notification) return null;

    return (
      <div className={`notification ${notification.type}`}>
        <span className="notification-icon">
          {notification.type === 'success' && '✅'}
          {notification.type === 'error' && '❌'}
          {notification.type === 'warning' && '⚠️'}
          {notification.type === 'info' && 'ℹ️'}
        </span>
        <span className="notification-message">{notification.message}</span>
        <button 
          className="notification-close"
          onClick={() => setNotification(null)}
        >
          ×
        </button>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <header className="app-header">
        <div className="header-left">
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <h1 className="app-title">
            <span className="title-icon">💰</span>
            Personal Finance Dashboard
          </h1>
        </div>

        <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <button 
            className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
            onClick={() => setView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`nav-item ${view === 'settings' ? 'active' : ''}`}
            onClick={() => setView('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="header-right">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <Button 
            variant="outline" 
            size="small"
            onClick={handleExportData}
          >
            📥 Export
          </Button>
        </div>
      </header>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="dashboard-view">
        <div className="dashboard-grid">
          {/* Main Content */}
          <div className="main-content">
            <Balance 
              total={totals.balance}
              income={totals.totalIncome}
              expenses={totals.totalExpenses}
            />
            
            <Card variant="elevated" padding="normal">
              <AddTransaction 
                setTransactions={handleAddTransaction}
                editingTransaction={selectedTransaction}
                onEditComplete={handleEditTransaction}
              />
            </Card>

            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={setSelectedTransaction}
            />
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            <Summary 
              transactions={transactions}
              totals={totals}
              stats={stats}
            />

            <Card variant="outlined" padding="small" className="quick-stats">
              <h3>Quick Stats</h3>
              <div className="stat-item">
                <span>Total Transactions:</span>
                <strong>{stats.totalTransactions}</strong>
              </div>
              <div className="stat-item">
                <span>Average:</span>
                <strong>${stats.averageTransaction.toFixed(2)}</strong>
              </div>
              <div className="stat-item">
                <span>Savings Rate:</span>
                <strong>{stats.savingsRate.toFixed(1)}%</strong>
              </div>
            </Card>

            {transactions.length > 0 && (
              <Card variant="outlined" padding="small" className="danger-zone">
                <h3>Danger Zone</h3>
                <Button 
                  variant="danger" 
                  size="small"
                  fullWidth
                  onClick={handleClearAllData}
                >
                  🗑️ Clear All Data
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <Suspense fallback={<LoadingSpinner size="large" text="Loading analytics..." />}>
        <Analytics 
          transactions={transactions}
          totals={totals}
          stats={stats}
        />
      </Suspense>
    );
  };

  const renderSettings = () => {
    return (
      <Suspense fallback={<LoadingSpinner size="large" text="Loading settings..." />}>
        <Settings 
          transactions={transactions}
          onImport={handleImportData}
          onExport={handleExportData}
          onClearAll={handleClearAllData}
        />
      </Suspense>
    );
  };

  // =========================================================================
  // Main Render
  // =========================================================================
  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Button 
          variant="primary" 
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {renderHeader()}
      {renderNotification()}
      
      <main className="app-main">
        {view === 'dashboard' && renderDashboard()}
        {view === 'analytics' && renderAnalytics()}
        {view === 'settings' && renderSettings()}
      </main>

      <footer className="app-footer">
        <p>© 2024 Personal Finance Dashboard. All rights reserved.</p>
        <p className="footer-stats">
          {transactions.length} transactions • 
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </footer>
    </div>
  );
}

export default App;