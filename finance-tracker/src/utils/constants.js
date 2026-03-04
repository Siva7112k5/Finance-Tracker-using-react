/**
 * Application Constants
 * Centralized configuration for the Personal Finance Dashboard
 * Follows DRY principle and makes maintenance easier
 */

// ============================================
// TRANSACTION TYPES
// ============================================
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Income',
  [TRANSACTION_TYPES.EXPENSE]: 'Expense'
};

export const TRANSACTION_TYPE_ICONS = {
  [TRANSACTION_TYPES.INCOME]: '💰',
  [TRANSACTION_TYPES.EXPENSE]: '💸'
};

export const TRANSACTION_TYPE_COLORS = {
  [TRANSACTION_TYPES.INCOME]: '#28a745',
  [TRANSACTION_TYPES.EXPENSE]: '#dc3545'
};

export const TRANSACTION_TYPE_BG = {
  [TRANSACTION_TYPES.INCOME]: '#e8f5e9',
  [TRANSACTION_TYPES.EXPENSE]: '#ffebee'
};

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  USER_PREFERENCES: 'finance_user_prefs',
  THEME: 'finance_theme',
  CURRENCY: 'finance_currency',
  LAST_SESSION: 'finance_last_session'
};

// ============================================
// CURRENCY CONFIGURATION
// ============================================
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
};

export const DEFAULT_CURRENCY = CURRENCIES.USD;

// ============================================
// VALIDATION RULES
// ============================================
export const VALIDATION = {
  TRANSACTION: {
    MIN_DESCRIPTION_LENGTH: 3,
    MAX_DESCRIPTION_LENGTH: 50,
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 1000000,
    ALLOWED_TYPES: [TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE]
  },
  CATEGORY: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 30
  }
};

// ============================================
// TRANSACTION CATEGORIES
// ============================================
export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#FF6B6B' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#45B7D1' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#96CEB4' },
  { id: 'bills', name: 'Bills & Utilities', icon: '📱', color: '#FFE194' },
  { id: 'health', name: 'Healthcare', icon: '🏥', color: '#E6B89C' },
  { id: 'education', name: 'Education', icon: '📚', color: '#9B5DE5' },
  { id: 'rent', name: 'Rent/Mortgage', icon: '🏠', color: '#F15BB5' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#00BBF9' },
  { id: 'other', name: 'Other', icon: '📦', color: '#A9A9A9' }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: '💼', color: '#28a745' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#17a2b8' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#ffc107' },
  { id: 'business', name: 'Business', icon: '🏢', color: '#6f42c1' },
  { id: 'gift', name: 'Gift', icon: '🎁', color: '#e83e8c' },
  { id: 'refund', name: 'Refund', icon: '↩️', color: '#20c997' },
  { id: 'rental', name: 'Rental Income', icon: '🏘️', color: '#fd7e14' },
  { id: 'other_income', name: 'Other', icon: '📦', color: '#6c757d' }
];

// ============================================
// DATE FORMATS
// ============================================
export const DATE_FORMATS = {
  DISPLAY: {
    FULL: 'PPPP',           // Monday, January 1, 2024
    MEDIUM: 'PP',           // Jan 1, 2024
    SHORT: 'P',             // 01/01/2024
    WITH_TIME: 'PPpp'       // Jan 1, 2024, 12:00 PM
  },
  API: 'yyyy-MM-dd',
  FILE_NAME: 'yyyy-MM-dd_HH-mm-ss'
};

// ============================================
// THEME CONFIGURATION
// ============================================
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const THEME_PREFERENCES = {
  [THEMES.LIGHT]: {
    name: 'Light',
    icon: '☀️',
    colors: {
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      textSecondary: '#6c757d',
      border: '#dee2e6'
    }
  },
  [THEMES.DARK]: {
    name: 'Dark',
    icon: '🌙',
    colors: {
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040'
    }
  }
};

// ============================================
// CHART CONFIGURATION
// ============================================
export const CHART_CONFIG = {
  COLORS: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFE194', '#E6B89C', '#9B5DE5', '#F15BB5',
    '#00BBF9', '#00F5D4'
  ],
  DEFAULT_HEIGHT: 300,
  ANIMATION_DURATION: 1000,
  RESPONSIVE: true
};

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_VISIBLE_PAGES: 5
};

// ============================================
// NOTIFICATION MESSAGES
// ============================================
export const MESSAGES = {
  SUCCESS: {
    TRANSACTION_ADDED: 'Transaction added successfully!',
    TRANSACTION_DELETED: 'Transaction deleted successfully!',
    TRANSACTION_UPDATED: 'Transaction updated successfully!',
    DATA_EXPORTED: 'Data exported successfully!',
    PREFERENCES_SAVED: 'Preferences saved!'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    VALIDATION: 'Please check your input and try again.',
    LOAD_FAILED: 'Failed to load data.',
    SAVE_FAILED: 'Failed to save data.'
  },
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes. Leave anyway?',
    DELETE_TRANSACTION: 'Are you sure you want to delete this transaction?',
    DATA_LOSS: 'This action cannot be undone.'
  }
};

// ============================================
// ANIMATION CONFIGURATION
// ============================================
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// ============================================
// DEFAULT TRANSACTIONS (for demo/empty state)
// ============================================
export const DEFAULT_TRANSACTIONS = [
  {
    id: 1,
    text: 'Initial Balance',
    amount: 1000,
    type: TRANSACTION_TYPES.INCOME,
    category: 'other_income',
    date: new Date().toISOString()
  },
  {
    id: 2,
    text: 'Groceries',
    amount: 150.75,
    type: TRANSACTION_TYPES.EXPENSE,
    category: 'food',
    date: new Date().toISOString()
  },
  {
    id: 3,
    text: 'Salary',
    amount: 3000,
    type: TRANSACTION_TYPES.INCOME,
    category: 'salary',
    date: new Date().toISOString()
  }
];

// ============================================
// BREAKPOINTS (for responsive design)
// ============================================
export const BREAKPOINTS = {
  XS: 320,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400
};

export const MEDIA_QUERIES = {
  XS: `(max-width: ${BREAKPOINTS.XS}px)`,
  SM: `(max-width: ${BREAKPOINTS.SM}px)`,
  MD: `(max-width: ${BREAKPOINTS.MD}px)`,
  LG: `(max-width: ${BREAKPOINTS.LG}px)`,
  XL: `(max-width: ${BREAKPOINTS.XL}px)`,
  XXL: `(max-width: ${BREAKPOINTS.XXL}px)`,
  ABOVE_SM: `(min-width: ${BREAKPOINTS.SM + 1}px)`,
  ABOVE_MD: `(min-width: ${BREAKPOINTS.MD + 1}px)`,
  ABOVE_LG: `(min-width: ${BREAKPOINTS.LG + 1}px)`
};

// ============================================
// LOCAL STORAGE VERSION CONTROL
// ============================================
export const STORAGE_VERSION = '1.0.0';

export const STORAGE_MIGRATIONS = {
  '1.0.0': (data) => {
    // Migration logic for version 1.0.0
    return data;
  }
};

// ============================================
// API ENDPOINTS (for future backend integration)
// ============================================
export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions',
  CATEGORIES: '/api/categories',
  USER_PREFERENCES: '/api/preferences',
  REPORTS: '/api/reports',
  EXPORT: '/api/export',
  IMPORT: '/api/import'
};

// ============================================
// REPORT TYPES
// ============================================
export const REPORT_TYPES = {
  MONTHLY_SUMMARY: 'monthly_summary',
  CATEGORY_BREAKDOWN: 'category_breakdown',
  TREND_ANALYSIS: 'trend_analysis',
  BUDGET_VS_ACTUAL: 'budget_vs_actual'
};

// ============================================
// EXPORT FORMATS
// ============================================
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
  EXCEL: 'xlsx'
};

// ============================================
// SORTING OPTIONS
// ============================================
export const SORT_OPTIONS = {
  DATE_DESC: { field: 'date', order: 'desc', label: 'Newest First' },
  DATE_ASC: { field: 'date', order: 'asc', label: 'Oldest First' },
  AMOUNT_DESC: { field: 'amount', order: 'desc', label: 'Highest Amount' },
  AMOUNT_ASC: { field: 'amount', order: 'asc', label: 'Lowest Amount' },
  DESCRIPTION_ASC: { field: 'text', order: 'asc', label: 'Description A-Z' },
  DESCRIPTION_DESC: { field: 'text', order: 'desc', label: 'Description Z-A' }
};

// ============================================
// FILTER PRESETS
// ============================================
export const FILTER_PRESETS = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_YEAR: 'this_year',
  LAST_MONTH: 'last_month',
  CUSTOM: 'custom'
};

// ============================================
// ACCESSIBILITY
// ============================================
export const ARIA_LABELS = {
  ADD_TRANSACTION: 'Add new transaction form',
  BALANCE: 'Current account balance',
  INCOME: 'Total income',
  EXPENSES: 'Total expenses',
  TRANSACTION_LIST: 'List of transactions',
  DELETE_BUTTON: 'Delete transaction',
  EDIT_BUTTON: 'Edit transaction',
  CHART: 'Financial chart',
  THEME_TOGGLE: 'Toggle dark mode',
  CURRENCY_SELECTOR: 'Select currency'
};

// ============================================
// ERROR CODES
// ============================================
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR'
};