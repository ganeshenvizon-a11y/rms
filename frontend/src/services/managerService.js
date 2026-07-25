import { DISHES, CATEGORIES, RESTAURANT_INFO } from '../utils/mockData';

// Storage Keys
const EMPLOYEES_STORAGE_KEY = 'bella_vista_employees';
const SETTINGS_STORAGE_KEY = 'bella_vista_manager_settings';
const RESERVATIONS_STORAGE_KEY = 'bella_vista_reservations';
const AUDIT_LOG_STORAGE_KEY = 'bella_vista_audit_logs';

export const INITIAL_EMPLOYEES = [
  {
    id: 'emp-101',
    name: 'Sundaram Pillai',
    role: 'General Manager',
    email: 'sundaram.p@dakshin.in',
    phone: '+91 98401 23456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    shift: 'Full Time (09:00 - 18:00)',
    status: 'Clocked In',
    hourlyRate: 38.50,
    joinDate: '2019-03-15',
    department: 'Management'
  },
  {
    id: 'emp-102',
    name: 'Chef Karthik Swaminathan',
    role: 'Executive Head Chef',
    email: 'karthik.chef@dakshin.in',
    phone: '+91 98402 34567',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Prep (08:00 - 16:30)',
    status: 'Clocked In',
    hourlyRate: 35.00,
    joinDate: '2020-01-10',
    department: 'Kitchen'
  },
  {
    id: 'emp-103',
    name: 'Ananya Nair',
    role: 'Senior Server',
    email: 'ananya.nair@dakshin.in',
    phone: '+91 98403 45678',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    shift: 'Evening Service (16:00 - 00:00)',
    status: 'Clocked In',
    hourlyRate: 22.00,
    joinDate: '2021-06-01',
    department: 'Floor Service'
  },
  {
    id: 'emp-104',
    name: 'Ramesh Kumar',
    role: 'POS Cashier & Sommelier',
    email: 'ramesh.k@dakshin.in',
    phone: '+91 98404 56789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    shift: 'Evening Service (15:30 - 23:30)',
    status: 'Clocked In',
    hourlyRate: 24.50,
    joinDate: '2021-11-20',
    department: 'Counter & Bar'
  },
  {
    id: 'emp-105',
    name: 'Chef Vignesh Iyer',
    role: 'Sous Chef (Dosa & Tiffin)',
    email: 'vignesh.i@dakshin.in',
    phone: '+91 98405 67890',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    shift: 'Evening Shift (14:00 - 22:30)',
    status: 'Off Duty',
    hourlyRate: 28.00,
    joinDate: '2022-04-12',
    department: 'Kitchen'
  },
  {
    id: 'emp-106',
    name: 'Priya Sharma',
    role: 'Host & Lead Reservationist',
    email: 'priya.s@dakshin.in',
    phone: '+91 98406 78901',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    shift: 'Morning Shift (10:00 - 18:00)',
    status: 'On Leave',
    hourlyRate: 20.00,
    joinDate: '2023-02-18',
    department: 'Floor Service'
  }
];

export const INITIAL_SETTINGS = {
  restaurantName: RESTAURANT_INFO.name,
  tagline: RESTAURANT_INFO.tagline,
  established: RESTAURANT_INFO.established,
  address: "100 Feet Road, Indiranagar Suite & Garden, Bengaluru 560038",
  phone: "+91 (80) 4123-8888",
  email: "contact@dakshinheritage.in",
  currency: "₹",
  taxRate: 5.0, // 5% GST
  vatRate: 8.0, // 8% VAT
  serviceCharge: 10.0, // 10% Service Charge
  tipSuggestions: [10, 15, 18, 20],
  operatingHours: {
    monday: "07:30 AM - 10:30 PM",
    tuesday: "07:30 AM - 10:30 PM",
    wednesday: "07:30 AM - 10:30 PM",
    thursday: "07:30 AM - 11:00 PM",
    friday: "07:30 AM - 11:30 PM",
    saturday: "07:00 AM - 11:30 PM",
    sunday: "07:00 AM - 10:30 PM"
  },
  receiptHeader: "Nandri / Thank you for dining at Dakshin Heritage!",
  receiptFooter: "Please visit us again! Authentic South Indian Culinary Gastronomy.",
  autoPrintReceipt: true,
  lowStockAlertThreshold: 5,
  kitchenDelayAlertMinutes: 15,
  enableOnlineOrders: true,
};

export const INITIAL_RESERVATIONS = [
  {
    id: 'res-301',
    guestName: 'Kalyan Sundaram',
    phone: '+91 98409 01234',
    partySize: 4,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    tableNumber: '04',
    section: 'Main Dining Room',
    status: 'Confirmed',
    notes: 'Family dinner. Requested Ghee Podi Dosa & Filter Coffee ready.'
  },
  {
    id: 'res-302',
    guestName: 'Dr. Meenakshi Raman',
    phone: '+91 98401 23456',
    partySize: 6,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    tableNumber: 'VIP-1',
    section: 'VIP Lounge',
    status: 'Confirmed',
    notes: 'VIP Guests. Chettinad Feast menu preference.'
  },
  {
    id: 'res-303',
    guestName: 'Arjun Menon',
    phone: '+91 98407 89012',
    partySize: 2,
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    tableNumber: '07',
    section: 'Patio Garden',
    status: 'Checked-in',
    notes: 'Outdoor dining preference.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    action: 'Price Update',
    user: 'Sundaram Pillai',
    timestamp: '2026-07-24 11:45 AM',
    details: 'Updated price of Ghee Roast Masala Dosa to ₹12.50',
    type: 'menu'
  },
  {
    id: 'log-2',
    action: 'Cash Till Drawer Unlocked',
    user: 'Ramesh Kumar',
    timestamp: '2026-07-24 10:15 AM',
    details: 'Manual till opening during morning float audit',
    type: 'finance'
  },
  {
    id: 'log-3',
    action: 'Staff Status Changed',
    user: 'Sundaram Pillai',
    timestamp: '2026-07-24 09:00 AM',
    details: 'Clocked in Chef Karthik Swaminathan for Morning Shift',
    type: 'staff'
  },
  {
    id: 'log-4',
    action: 'Settings Saved',
    user: 'Sundaram Pillai',
    timestamp: '2026-07-23 18:30 PM',
    details: 'Updated receipt footer text & Filter Coffee brewing alert threshold',
    type: 'system'
  }
];

// Analytics Mock Data
export const REPORTS_MOCK_DATA = {
  salesOverview: {
    grossSales: 4850.75,
    netRevenue: 4218.00,
    totalOrders: 142,
    avgTicket: 34.16,
    taxCollected: 242.53,
    vatCollected: 388.06,
    discountsGiven: 120.00,
    tipsCollected: 640.50
  },
  hourlyTraffic: [
    { hour: '08 AM', orders: 18, sales: 420 },
    { hour: '09 AM', orders: 32, sales: 880 },
    { hour: '10 AM', orders: 28, sales: 740 },
    { hour: '11 AM', orders: 15, sales: 510 },
    { hour: '12 PM', orders: 30, sales: 980 },
    { hour: '01 PM', orders: 42, sales: 1520 },
    { hour: '02 PM', orders: 26, sales: 810 },
    { hour: '05 PM', orders: 20, sales: 580 },
    { hour: '06 PM', orders: 35, sales: 1190 },
    { hour: '07 PM', orders: 48, sales: 1650 },
    { hour: '08 PM', orders: 40, sales: 1420 },
    { hour: '09 PM', orders: 22, sales: 780 },
  ],
  paymentSplit: [
    { method: 'Credit / Debit Card', amount: 2910.45, percentage: 60, icon: 'CreditCard' },
    { method: 'Cash', amount: 1212.68, percentage: 25, icon: 'Banknote' },
    { method: 'UPI / Digital QR', amount: 727.62, percentage: 15, icon: 'QrCode' },
  ],
  categoryPerformance: [
    { name: 'Dosas & Tiffins', sales: 1820.00, count: 94, color: 'bg-amber-500' },
    { name: 'Biryanis & Rice Specials', sales: 1480.50, count: 72, color: 'bg-rose-500' },
    { name: 'Curries & Gravies', sales: 890.00, count: 42, color: 'bg-emerald-500' },
    { name: 'Vadas & Appetizers', sales: 520.00, count: 58, color: 'bg-indigo-500' },
    { name: 'Payasam & Sweets', sales: 340.25, count: 35, color: 'bg-purple-500' },
    { name: 'Filter Coffee & Drinks', sales: 680.00, count: 110, color: 'bg-yellow-500' }
  ],
  topDishes: [
    { name: 'Desi Ghee Roast Masala Dosa', category: 'Dosas', quantity: 56, revenue: 700.00, rating: 4.9 },
    { name: 'Chettinad Seeraga Samba Chicken Biryani', category: 'Biryani', quantity: 42, revenue: 819.00, rating: 4.9 },
    { name: 'Steamed Rice Idli & Medu Vada Platter', category: 'Starters', quantity: 48, revenue: 432.00, rating: 4.8 },
    { name: 'Malabar Coconut Fish Curry (Meen Curry)', category: 'Curries', quantity: 30, revenue: 630.00, rating: 4.9 },
    { name: 'Kumbakonam Degree Filter Kaapi', category: 'Beverages', quantity: 84, revenue: 378.00, rating: 4.9 }
  ],
  staffPerformance: [
    { name: 'Ananya Nair', role: 'Senior Server', tablesServed: 32, totalSales: 1280.00, avgRating: 4.9, tips: 210.00 },
    { name: 'Ramesh Kumar', role: 'POS Cashier', tablesServed: 38, totalSales: 1540.50, avgRating: 4.8, tips: 245.00 },
    { name: 'Priya Sharma', role: 'Hostess', tablesServed: 24, totalSales: 920.00, avgRating: 4.9, tips: 140.00 }
  ]
};

// Storage Access Helper Functions
export const getStoredEmployees = () => {
  try {
    const data = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
  } catch (e) {
    console.error("Error reading employees from localStorage", e);
    return INITIAL_EMPLOYEES;
  }
};

export const setStoredEmployees = (employees) => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (e) {
    console.error("Error saving employees to localStorage", e);
  }
};

export const getStoredManagerSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  } catch (e) {
    console.error("Error reading settings from localStorage", e);
    return INITIAL_SETTINGS;
  }
};

export const setStoredManagerSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving settings to localStorage", e);
  }
};

export const getStoredReservations = () => {
  try {
    const data = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_RESERVATIONS;
  } catch (e) {
    console.error("Error reading reservations from localStorage", e);
    return INITIAL_RESERVATIONS;
  }
};

export const setStoredReservations = (reservations) => {
  try {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  } catch (e) {
    console.error("Error saving reservations to localStorage", e);
  }
};

export const getStoredAuditLogs = () => {
  try {
    const data = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  } catch (e) {
    console.error("Error reading audit logs from localStorage", e);
    return INITIAL_AUDIT_LOGS;
  }
};

export const addAuditLog = (action, details, type = 'system', user = 'Sundaram Pillai') => {
  const currentLogs = getStoredAuditLogs();
  const newLog = {
    id: `log-${Date.now()}`,
    action,
    user,
    timestamp: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    details,
    type
  };
  const updated = [newLog, ...currentLogs];
  try {
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving audit log", e);
  }
  return updated;
};
