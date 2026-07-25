import api, { mockApiDelay } from './api';

export const paymentService = {
  // Process online / cash payment
  async processPayment(paymentDetails) {
    try {
      // Production: return await api.post('/payments/process', paymentDetails);
      const transactionId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
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
      const receiptContent = `
=========================================
          DAKSHIN HERITAGE
    Authentic South Indian Gastronomy
       Indiranagar Suite & Garden
=========================================
Order ID: #${orderId}
Date: ${new Date().toLocaleString()}
Transaction Ref: ${transactionDetails?.transactionId || 'CASH-PAY'}
Payment Method: ${transactionDetails?.method || 'Card/UPI'}

Total Amount Paid: $${transactionDetails?.amount?.toFixed(2) || '0.00'}

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
