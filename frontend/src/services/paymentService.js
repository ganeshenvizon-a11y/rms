import api, { mockApiDelay } from './api';
import { formatInvoiceAmount, formatDateTime } from '../utils/formatters';
import { restaurantConfig } from '../config/restaurantConfig';

export const paymentService = {
  // Process online / cash payment
  async processPayment(paymentDetails) {
    try {
      // Production: return await api.post('/payments/process', paymentDetails);
      const transactionId = `${restaurantConfig.invoiceRules.invoicePrefix || 'INV'}-TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      return await mockApiDelay({
        success: true,
        transactionId,
        paymentMethod: paymentDetails.method,
        amount: paymentDetails.amount,
        timestamp: new Date().toISOString(),
      }, 1500);
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },

  // Download receipt / generate invoice text
  async downloadReceipt(orderId, transactionDetails) {
    try {
      const formattedDate = formatDateTime(new Date());
      const formattedAmount = formatInvoiceAmount(transactionDetails?.amount || 0);

      const receiptContent = `
=========================================
          DAKSHIN HERITAGE
    Authentic South Indian Gastronomy
       Indiranagar Suite & Garden
=========================================
Document Title: ${restaurantConfig.invoiceRules.documentTitle}
GSTIN: ${restaurantConfig.invoiceRules.gstin} | FSSAI: ${restaurantConfig.invoiceRules.fssaiNumber}
Order ID: #${orderId}
Date: ${formattedDate}
Transaction Ref: ${transactionDetails?.transactionId || 'CASH-PAY'}
Payment Method: ${transactionDetails?.method || 'Card/UPI'}

Total Amount Paid: ${formattedAmount}

Nandri & Vanakkam!
Thank you for dining with us at Dakshin Heritage.
=========================================
      `;
      return await mockApiDelay({ receiptText: receiptContent, filename: `Receipt-${orderId}.txt` });
    } catch (error) {
      console.error("Error generating receipt:", error);
      throw error;
    }
  }
};
