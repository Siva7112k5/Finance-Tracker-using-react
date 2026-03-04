// src/App.js
import React, { useState, lazy, Suspense } from 'react';
import Balance from './components/Balance/Balance';
import TransactionList from './components/TransactionList/TransactionList';
import AddTransaction from './components/AddTransaction/AddTransaction';
import Summary from './components/Summary/Summary';
import { Button, LoadingSpinner } from './components/UI';
import useLocalStorage from './hooks/useLocalStorage';
import useTheme from './hooks/useTheme';
import { STORAGE_KEYS } from './utils/constants';
import { calculateTotals } from './utils/calculations';
import './App.css';

// Lazy load less critical components
const Analytics = lazy(() => import('./components/Analytics/Analytics'));
const Settings = lazy(() => import('./components/Settings/Settings'));

function App() {
  const [transactions, setTransactions] = useLocalStorage(STORAGE_KEYS.TRANSACTIONS, []);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTheme, isDarkMode } = useTheme();

  const totals = calculateTotals(transactions);

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Professional Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo">
              <span className="logo-icon">💰</span>
              <span className="logo-text">FinanTrack</span>
            </div>
            
            <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
              <button 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button 
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('analytics');
                  setIsMobileMenuOpen(false);
                }}
              >
                Analytics
              </button>
              <button 
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileMenuOpen(false);
                }}
              >
                Settings
              </button>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
          </div>

          <div className="nav-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="welcome-banner">
                <h1>Welcome back, User! 👋</h1>
                <p>Track your finances and achieve your financial goals</p>
              </div>

              {/* Stats Overview */}
              <div className="stats-overview">
                <div className="stat-card">
                  <span className="stat-label">Total Balance</span>
                  <span className={`stat-value ${totals.balance >= 0 ? 'positive' : 'negative'}`}>
                    ${totals.balance.toFixed(2)}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Income</span>
                  <span className="stat-value income">${totals.totalIncome.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Expenses</span>
                  <span className="stat-value expense">${totals.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Transactions</span>
                  <span className="stat-value">{transactions.length}</span>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="dashboard-grid">
                <div className="dashboard-main">
                  <AddTransaction 
                    setTransactions={handleAddTransaction}
                    onEditComplete={handleEditTransaction}
                  />
                  <TransactionList 
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                    onEdit={handleEditTransaction}
                  />
                </div>
                <div className="dashboard-sidebar">
                  <Balance 
                    total={totals.balance}
                    income={totals.totalIncome}
                    expenses={totals.totalExpenses}
                  />
                  <Summary transactions={transactions} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Analytics transactions={transactions} totals={totals} />
            </Suspense>
          )}

          {activeTab === 'settings' && (
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
            </Suspense>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>FinanTrack</h3>
              <p>Your personal finance companion for a better financial future.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#terms">Terms of Service</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="#twitter">🐦 Twitter</a>
                <a href="#linkedin">💼 LinkedIn</a>
                <a href="#github">💻 GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 FinanTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;