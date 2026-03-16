/**
 * Currency formatting utilities for Indian Rupee (INR)
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

export const formatCurrencyShort = (amount: number): string => {
  // For displaying abbreviated amounts (e.g., ₹1.2K, ₹15K)
  if (amount >= 10000000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  }
  if (amount >= 100000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  }
  if (amount >= 1000) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      compactDisplay: 'short'
    }).format(amount);
  }
  return formatCurrency(amount);
};

export const formatCurrencyPlain = (amount: number): string => {
  // For displaying amounts without currency symbol
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};