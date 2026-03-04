export const validateTransaction = (formData) => {
  const errors = {};

  // Validate description
  if (!formData.text || formData.text.trim() === '') {
    errors.text = 'Description is required';
  } else if (formData.text.length < 3) {
    errors.text = 'Description must be at least 3 characters';
  } else if (formData.text.length > 50) {
    errors.text = 'Description must be less than 50 characters';
  }

  // Validate amount
  if (!formData.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      errors.amount = 'Amount must be a valid number';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (amount > 1000000) {
      errors.amount = 'Amount cannot exceed $1,000,000';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatAmountForDisplay = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};