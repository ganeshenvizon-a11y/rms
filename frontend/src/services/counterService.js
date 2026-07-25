export const INITIAL_RECEIPTS = [
  {
    receiptNo: "REC-2026-0891",
    orderId: "ORD-8042",
    tableNumber: "03",
    serverName: "Kavitha Raman",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    paymentMethod: "Credit Card",
    cardBrand: "Visa ending in 4921",
    subtotal: 64.00,
    tax: 3.20, // 5%
    vat: 5.12, // 8%
    discount: 0,
    tip: 10.00,
    grandTotal: 82.32,
    status: "paid",
    items: [
      { name: "Chettinad Seeraga Samba Chicken Biryani", quantity: 2, price: 19.50, total: 39.00 },
      { name: "Malabar Layered Parotta & Veg Kurma", quantity: 1, price: 16.50, total: 16.50 },
      { name: "Kumbakonam Degree Filter Kaapi", quantity: 2, price: 4.25, total: 8.50 }
    ]
  },
  {
    receiptNo: "REC-2026-0890",
    orderId: "ORD-8039",
    tableNumber: "07",
    serverName: "Arun Prakash",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    paymentMethod: "Cash",
    tenderedAmount: 50.00,
    changeGiven: 8.52,
    subtotal: 36.50,
    tax: 1.83,
    vat: 2.92,
    discount: 0,
    tip: 0.23,
    grandTotal: 41.48,
    status: "paid",
    items: [
      { name: "Desi Ghee Roast Masala Dosa", quantity: 2, price: 12.50, total: 25.00 },
      { name: "Steamed Rice Idli & Medu Vada Platter", quantity: 1, price: 9.00, total: 9.00 },
      { name: "Madurai Special Cooling Jigarthanda", quantity: 1, price: 6.00, total: 6.00 }
    ]
  },
  {
    receiptNo: "REC-2026-0889",
    orderId: "ORD-8031",
    tableNumber: "12",
    serverName: "Priya Nair",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    paymentMethod: "UPI / QR Code",
    referenceNo: "UPI-9823140921",
    subtotal: 82.50,
    tax: 4.13,
    vat: 6.60,
    discount: 5.00,
    tip: 8.00,
    grandTotal: 96.23,
    status: "paid",
    items: [
      { name: "Hyderabadi Shahi Paneer Dum Biryani", quantity: 2, price: 18.00, total: 36.00 },
      { name: "Malabar Coconut Fish Curry (Meen Curry)", quantity: 2, price: 21.00, total: 42.00 },
      { name: "Tender Coconut Elaneer Payasam", quantity: 2, price: 8.50, total: 17.00 }
    ]
  }
];

export const INITIAL_REGISTER_SESSION = {
  registerId: "POS-REGISTER-01",
  cashierName: "Marco Rossi",
  shiftStartTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
  openingFloat: 250.00,
  cashCollected: 312.48,
  cardCollected: 842.10,
  upiCollected: 420.50,
  totalRefunds: 0.00,
  isDrawerOpen: false
};

export const getStoredReceipts = () => {
  try {
    const data = localStorage.getItem("counter_receipts");
    return data ? JSON.parse(data) : INITIAL_RECEIPTS;
  } catch (err) {
    console.error("Failed to load stored receipts", err);
    return INITIAL_RECEIPTS;
  }
};

export const setStoredReceipts = (receipts) => {
  try {
    localStorage.setItem("counter_receipts", JSON.stringify(receipts));
  } catch (err) {
    console.error("Failed to save receipts", err);
  }
};

export const getStoredRegisterSession = () => {
  try {
    const data = localStorage.getItem("counter_register_session");
    return data ? JSON.parse(data) : INITIAL_REGISTER_SESSION;
  } catch (err) {
    console.error("Failed to load register session", err);
    return INITIAL_REGISTER_SESSION;
  }
};

export const setStoredRegisterSession = (session) => {
  try {
    localStorage.setItem("counter_register_session", JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save register session", err);
  }
};
