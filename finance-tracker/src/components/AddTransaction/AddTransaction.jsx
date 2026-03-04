import React, { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import { validateTransaction } from '../../utils/validators';
import './AddTransaction.css';

const AddTransaction = ({ setTransactions }) => {
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    type: 'expense'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateTransaction(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      text: formData.text,
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date().toISOString()
    };

    // Update transactions using functional update pattern
    setTransactions(prev => [newTransaction, ...prev]);

    // Reset form
    setFormData({
      text: '',
      amount: '',
      type: 'expense'
    });
    setErrors({});
    setIsSubmitting(false);
  };

  const quickAddAmount = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: prev.amount ? parseFloat(prev.amount) + amount : amount
    }));
  };

  return (
    <Card className="add-transaction">
      <h3>Add New Transaction</h3>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        {/* Transaction Type Toggle */}
        <div className="type-toggle">
          <label className={`type-option ${formData.type === 'expense' ? 'active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleInputChange}
            />
            <span className="type-indicator expense">💸 Expense</span>
          </label>
          
          <label className={`type-option ${formData.type === 'income' ? 'active' : ''}`}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleInputChange}
            />
            <span className="type-indicator income">💰 Income</span>
          </label>
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="text">
            Description <span className="required">*</span>
          </label>
          <Input
            id="text"
            name="text"
            type="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="e.g., Grocery shopping, Salary, Rent..."
            error={errors.text}
            className={errors.text ? 'error' : ''}
          />
          {errors.text && <span className="error-message">{errors.text}</span>}
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="amount">
            Amount <span className="required">*</span>
          </label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              error={errors.amount}
              className={errors.amount ? 'error' : ''}
            />
          </div>
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        {/* Quick Amount Selector */}
        <div className="quick-amounts">
          <span className="quick-label">Quick add:</span>
          <div className="quick-buttons">
            <button 
              type="button" 
              onClick={() => quickAddAmount(10)}
              className="quick-btn"
            >
              +$10
            </button>
            <button 
              type="button" 
              onClick={() => quickAddAmount(20)}
              className="quick-btn"
            >
              +$20
            </button>
            <button 
              type="button" 
              onClick={() => quickAddAmount(50)}
              className="quick-btn"
            >
              +$50
            </button>
            <button 
              type="button" 
              onClick={() => quickAddAmount(100)}
              className="quick-btn"
            >
              +$100
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className={`submit-btn ${formData.type}`}
        >
          {isSubmitting ? 'Adding...' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
        </Button>
      </form>
    </Card>
  );
};

export default AddTransaction;