export const INITIAL_RECEIPTS = [
  {
    receiptNo: "INV-2026-0891",
    orderId: "ORD-8042",
    tableNumber: "03",
    serverName: "Kavitha Raman",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    paymentMethod: "UPI / QR Code",
    referenceNo: "UPI-9823140921",
    subtotal: 1000.00,
    discount: 100.00,
    packagingCharge: 20.00,
    taxableAmount: 920.00,
    gst: 46.00,
    tax: 46.00,
    cgst: 23.00,
    sgst: 23.00,
    vat: 0,
    total: 966.00,
    tip: 0.00,
    totalPayable: 966.00,
    grandTotal: 966.00,
    status: "paid",
    items: [
      { name: "Chettinad Seeraga Samba Chicken Biryani", quantity: 2, price: 320.00, total: 640.00 },
      { name: "Special South Veg Thali", quantity: 1, price: 220.00, total: 220.00 },
      { name: "Desi Ghee Roast Masala Dosa", quantity: 1, price: 140.00, total: 140.00 }
    ]
  },
  {
    receiptNo: "INV-2026-0890",
    orderId: "ORD-8039",
    tableNumber: "07",
    serverName: "Arun Prakash",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    paymentMethod: "Cash",
    tenderedAmount: 500.00,
    changeGiven: 11.75,
    subtotal: 465.00,
    discount: 0,
    packagingCharge: 0,
    taxableAmount: 465.00,
    gst: 23.25,
    tax: 23.25,
    cgst: 11.63,
    sgst: 11.62,
    vat: 0,
    total: 488.25,
    tip: 0.00,
    totalPayable: 488.25,
    grandTotal: 488.25,
    status: "paid",
    items: [
      { name: "Desi Ghee Roast Masala Dosa", quantity: 2, price: 140.00, total: 280.00 },
      { name: "Plain Crisp Rice Dosa", quantity: 1, price: 90.00, total: 90.00 },
      { name: "Kulhad Masala Chai", quantity: 2, price: 40.00, total: 80.00 }
    ]
  },
  {
    receiptNo: "INV-2026-0889",
    orderId: "ORD-8031",
    tableNumber: "12",
    serverName: "Priya Nair",
    cashierName: "Sundaram Pillai",
    timestamp: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    paymentMethod: "Credit Card",
    cardBrand: "Visa ending in 4921",
    subtotal: 800.00,
    discount: 50.00,
    packagingCharge: 0,
    taxableAmount: 750.00,
    gst: 37.50,
    tax: 37.50,
    cgst: 18.75,
    sgst: 18.75,
    vat: 0,
    total: 787.50,
    tip: 20.00,
    totalPayable: 807.50,
    grandTotal: 807.50,
    status: "paid",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 290.00, total: 580.00 },
      { name: "Tender Coconut Elaneer Payasam", quantity: 2, price: 110.00, total: 220.00 }
    ]
  }
];

export const INITIAL_REGISTER_SESSION = {
  registerId: "POS-REGISTER-01",
  cashierName: "Imran Khan",
  shiftStartTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
  openingFloat: 2000.00,
  cashCollected: 7688.00,
  cardCollected: 12600.00,
  upiCollected: 30420.00,
  totalRefunds: 640.00,
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
