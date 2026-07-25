import { RESTAURANT_INFO } from './mockData';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const generateOrderId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TBV-${randomNum}`;
};

export const calculateCartTotals = (items = [], tipPercentage = 0) => {
  const subtotal = items.reduce((acc, item) => {
    const itemPrice = item.price + (item.selectedCustomizations?.reduce((cAcc, opt) => cAcc + opt.price, 0) || 0);
    return acc + (itemPrice * item.quantity);
  }, 0);

  const tax = subtotal * RESTAURANT_INFO.taxRate;
  const vat = subtotal * RESTAURANT_INFO.vatRate;
  const tipAmount = (subtotal * tipPercentage) / 100;
  const grandTotal = subtotal + tax + vat + tipAmount;

  return {
    subtotal: Math.max(0, subtotal),
    tax: Math.max(0, tax),
    vat: Math.max(0, vat),
    tipAmount: Math.max(0, tipAmount),
    grandTotal: Math.max(0, grandTotal),
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
  };
};
