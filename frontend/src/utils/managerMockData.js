export const dashboardMockData = {
  dateLabel: 'Today, 27 July 2026',
  reportingPeriod: '12:00 AM – 5:54 PM',
  comparisonLabel: 'Compared with previous Monday',
  lastUpdated: '5:54 PM',

  completedOrders: 186,
  pendingOrders: 4,
  cancelledOrders: 7,

  grossSales: 50708,
  discounts: 2150,
  refunds: 640,
  netCollected: 47918,

  averageOrderValue: 272.62,

  paymentBreakdown: [
    { method: 'UPI', amount: 30420, transactions: 112, percentage: 60.0, color: 'bg-primary' },
    { method: 'Card', amount: 12600, transactions: 43, percentage: 24.8, color: 'bg-secondary' },
    { method: 'Cash', amount: 7688, transactions: 31, percentage: 15.2, color: 'bg-amber-600' },
  ],

  hourlySales: [
    { time: '11 AM', amount: 4200, orders: 15, percentage: 8.3 },
    { time: '12 PM', amount: 7100, orders: 26, percentage: 14.0 },
    { time: '1 PM', amount: 9800, orders: 36, percentage: 19.3 },
    { time: '2 PM', amount: 6600, orders: 24, percentage: 13.0 },
    { time: '3 PM', amount: 3200, orders: 12, percentage: 6.3 },
    { time: '4 PM', amount: 5800, orders: 21, percentage: 11.4 },
    { time: '5 PM', amount: 14008, orders: 52, percentage: 27.6 },
  ],

  popularItems: [
    { rank: 1, name: 'Chicken Biryani', quantity: 68, revenue: 21760, contribution: '42.9%' },
    { rank: 2, name: 'Masala Dosa', quantity: 54, revenue: 7560, contribution: '14.9%' },
    { rank: 3, name: 'Filter Coffee', quantity: 77, revenue: 4620, contribution: '9.1%' },
    { rank: 4, name: 'Veg Thali', quantity: 46, revenue: 10120, contribution: '20.0%' },
    { rank: 5, name: 'Paneer Butter Masala', quantity: 23, revenue: 6648, contribution: '13.1%' },
  ],

  activeStaff: [
    {
      id: 'staff-1',
      name: 'Rahul Sharma',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 48,
      salesHandled: 13240,
      avgOrderValue: 275.83,
    },
    {
      id: 'staff-2',
      name: 'Ananya Reddy',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 44,
      salesHandled: 11980,
      avgOrderValue: 272.27,
    },
    {
      id: 'staff-3',
      name: 'Imran Khan',
      role: 'Counter',
      status: 'On Shift',
      ordersHandled: 51,
      salesHandled: 14388,
      avgOrderValue: 282.12,
    },
    {
      id: 'staff-4',
      name: 'Sneha Patel',
      role: 'Waiter',
      status: 'On Shift',
      ordersHandled: 43,
      salesHandled: 11100,
      avgOrderValue: 258.14,
    },
  ],

  unavailableStaff: [
    {
      id: 'staff-5',
      name: 'Priya Nair',
      role: 'Waiter',
      status: 'On Leave',
    },
  ],

  drillDownMockDetails: {
    transactions: [
      { id: 'TXN-901', time: '5:42 PM', table: 'Table 04', items: '2x Chicken Biryani, 2x Filter Coffee', method: 'UPI', amount: 700, status: 'Completed' },
      { id: 'TXN-902', time: '5:30 PM', table: 'Table 08', items: '1x Veg Thali, 1x Paneer Butter Masala', method: 'Card', amount: 510, status: 'Completed' },
      { id: 'TXN-903', time: '5:15 PM', table: 'Table 02', items: '3x Masala Dosa, 3x Filter Coffee', method: 'Cash', amount: 600, status: 'Completed' },
      { id: 'TXN-904', time: '4:50 PM', table: 'Table 11', items: '4x Chicken Biryani', method: 'UPI', amount: 1280, status: 'Completed' },
      { id: 'TXN-905', time: '4:25 PM', table: 'Table 05', items: '2x Veg Thali, 2x Masala Dosa', method: 'Card', amount: 720, status: 'Completed' },
    ],
    completedOrders: [
      { id: 'ORD-8101', time: '5:40 PM', server: 'Rahul Sharma', table: 'Table 04', amount: 700, itemsCount: 4 },
      { id: 'ORD-8100', time: '5:28 PM', server: 'Ananya Reddy', table: 'Table 08', amount: 510, itemsCount: 2 },
      { id: 'ORD-8099', time: '5:10 PM', server: 'Imran Khan', table: 'Counter POS', amount: 600, itemsCount: 6 },
      { id: 'ORD-8098', time: '4:45 PM', server: 'Sneha Patel', table: 'Table 11', amount: 1280, itemsCount: 4 },
    ],
    hourlyTransactions: [
      { timeBucket: '11:00 AM – 12:00 PM', orders: 15, sales: 4200, peakItem: 'Masala Dosa' },
      { timeBucket: '12:00 PM – 01:00 PM', orders: 26, sales: 7100, peakItem: 'Veg Thali' },
      { timeBucket: '01:00 PM – 02:00 PM', orders: 36, sales: 9800, peakItem: 'Chicken Biryani' },
      { timeBucket: '02:00 PM – 03:00 PM', orders: 24, sales: 6600, peakItem: 'Paneer Butter Masala' },
      { timeBucket: '03:00 PM – 04:00 PM', orders: 12, sales: 3200, peakItem: 'Filter Coffee' },
      { timeBucket: '04:00 PM – 05:00 PM', orders: 21, sales: 5800, peakItem: 'Masala Dosa' },
      { timeBucket: '05:00 PM – 05:54 PM', orders: 52, sales: 14008, peakItem: 'Chicken Biryani' },
    ],
    paymentRecords: [
      { method: 'UPI Settlement', gateway: 'PhonePe / GPay PG', totalAmount: 30420, count: 112, status: 'Reconciled' },
      { method: 'Card Terminal', gateway: 'HDFC POS Terminal', totalAmount: 12600, count: 43, status: 'Reconciled' },
      { method: 'Cash Till Drawer', gateway: 'POS Drawer #01', totalAmount: 7688, count: 31, status: 'Reconciled' },
    ],
    itemOrders: [
      { name: 'Chicken Biryani', price: 320, qtySold: 68, totalRevenue: 21760, category: 'Biryanis' },
      { name: 'Masala Dosa', price: 140, qtySold: 54, totalRevenue: 7560, category: 'Dosas' },
      { name: 'Filter Coffee', price: 60, qtySold: 77, totalRevenue: 4620, category: 'Beverages' },
      { name: 'Veg Thali', price: 220, qtySold: 46, totalRevenue: 10120, category: 'Thalis' },
      { name: 'Paneer Butter Masala', price: 289, qtySold: 23, totalRevenue: 6648, category: 'Curries' },
    ],
    employeeActivity: [
      { name: 'Rahul Sharma', role: 'Waiter', shift: '09:00 AM - 06:00 PM', orders: 48, totalSales: 13240, avgOrder: 275.83 },
      { name: 'Ananya Reddy', role: 'Waiter', shift: '09:00 AM - 06:00 PM', orders: 44, totalSales: 11980, avgOrder: 272.27 },
      { name: 'Imran Khan', role: 'Counter Cashier', shift: '08:30 AM - 05:30 PM', orders: 51, totalSales: 14388, avgOrder: 282.12 },
      { name: 'Sneha Patel', role: 'Waiter', shift: '10:00 AM - 07:00 PM', orders: 43, totalSales: 11100, avgOrder: 258.14 },
    ]
  }
};
