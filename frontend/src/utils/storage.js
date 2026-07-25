const CART_KEY = 'tbv_restaurant_cart';
const TABLE_KEY = 'tbv_restaurant_table';
const ACTIVE_ORDER_KEY = 'tbv_restaurant_active_order';
const KITCHEN_ORDERS_KEY = 'tbv_restaurant_kitchen_orders';
const ASSISTANCE_KEY = 'tbv_restaurant_assistance_requests';
const KITCHEN_AUTH_KEY = 'tbv_restaurant_kitchen_auth';
const WAITER_TABLES_KEY = 'tbv_restaurant_waiter_tables';
const BILL_REQUESTS_KEY = 'tbv_restaurant_bill_requests';
const KITCHEN_PREFS_KEY = 'tbv_restaurant_kitchen_prefs';
const ISSUE_REPORT_KEY = 'tbv_restaurant_issue_report';

export const getStoredCart = () => {
  try {
    const item = localStorage.getItem(CART_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error("Error reading cart from localStorage", e);
    return [];
  }
};

export const setStoredCart = (cartItems) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (e) {
    console.error("Error writing cart to localStorage", e);
  }
};

export const clearStoredCart = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (e) {
    console.error("Error clearing cart from localStorage", e);
  }
};

export const getStoredTable = () => {
  try {
    return localStorage.getItem(TABLE_KEY) || '05';
  } catch (e) {
    return '05';
  }
};

export const setStoredTable = (tableNo) => {
  try {
    localStorage.setItem(TABLE_KEY, tableNo);
  } catch (e) {
    console.error("Error saving table to localStorage", e);
  }
};

export const getStoredOrder = () => {
  try {
    const item = localStorage.getItem(ACTIVE_ORDER_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredOrder = (orderData) => {
  try {
    localStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(orderData));
  } catch (e) {
    console.error("Error saving order to localStorage", e);
  }
};

export const clearStoredOrder = () => {
  try {
    localStorage.removeItem(ACTIVE_ORDER_KEY);
  } catch (e) {
    console.error("Error clearing order from localStorage", e);
  }
};

export const getStoredKitchenOrders = () => {
  try {
    const item = localStorage.getItem(KITCHEN_ORDERS_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredKitchenOrders = (orders) => {
  try {
    localStorage.setItem(KITCHEN_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Error saving kitchen orders to localStorage", e);
  }
};

export const getStoredAssistanceRequests = () => {
  try {
    const item = localStorage.getItem(ASSISTANCE_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredAssistanceRequests = (requests) => {
  try {
    localStorage.setItem(ASSISTANCE_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving assistance requests to localStorage", e);
  }
};

export const getStoredKitchenAuth = () => {
  try {
    const item = localStorage.getItem(KITCHEN_AUTH_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredKitchenAuth = (authData) => {
  try {
    localStorage.setItem(KITCHEN_AUTH_KEY, JSON.stringify(authData));
  } catch (e) {
    console.error("Error saving kitchen auth to localStorage", e);
  }
};

export const clearStoredKitchenAuth = () => {
  try {
    localStorage.removeItem(KITCHEN_AUTH_KEY);
  } catch (e) {
    console.error("Error clearing kitchen auth from localStorage", e);
  }
};

export const getStoredWaiterTables = () => {
  try {
    const item = localStorage.getItem(WAITER_TABLES_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredWaiterTables = (tables) => {
  try {
    localStorage.setItem(WAITER_TABLES_KEY, JSON.stringify(tables));
  } catch (e) {
    console.error("Error saving waiter tables to localStorage", e);
  }
};

export const getStoredBillRequests = () => {
  try {
    const item = localStorage.getItem(BILL_REQUESTS_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredBillRequests = (requests) => {
  try {
    localStorage.setItem(BILL_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving bill requests to localStorage", e);
  }
};

export const getStoredKitchenPrefs = () => {
  try {
    const item = localStorage.getItem(KITCHEN_PREFS_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredKitchenPrefs = (prefs) => {
  try {
    localStorage.setItem(KITCHEN_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error("Error saving kitchen prefs to localStorage", e);
  }
};

export const getStoredIssueReport = () => {
  try {
    const item = localStorage.getItem(ISSUE_REPORT_KEY);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredIssueReport = (report) => {
  try {
    localStorage.setItem(ISSUE_REPORT_KEY, JSON.stringify(report));
  } catch (e) {
    console.error("Error saving issue report to localStorage", e);
  }
};

export const clearStoredIssueReport = () => {
  try {
    localStorage.removeItem(ISSUE_REPORT_KEY);
  } catch (e) {
    console.error("Error clearing issue report from localStorage", e);
  }
};



