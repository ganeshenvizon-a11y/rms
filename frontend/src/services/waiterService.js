export const WAITER_PROFILE = {
  id: 'w-101',
  employeeId: 'STF-2024',
  name: 'Elena Vance',
  role: 'Senior Waiter & Terrace Lead',
  badge: 'FLORENTINE SUITE LEAD',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  onDuty: true,
  assignedSection: 'Florentine Garden & Main Hall',
  currentShift: 'Afternoon Shift',
  shiftStartedAt: '11:00 AM',
  hoursWorked: 4.5,
  shiftStats: {
    tablesServed: 18,
    avgServiceMinutes: 6.2,
    tipsEarned: 84.50,
    activeTablesCount: 5,
    customerRating: 4.95,
  }
};

export const INITIAL_WAITER_TABLES = [
  {
    tableNumber: '01',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available', // 'available' | 'seated' | 'cooking' | 'ready' | 'call_waiter' | 'bill_requested'
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '02',
    section: 'Indoor Main Hall',
    capacity: 4,
    status: 'cooking',
    serverName: 'Elena Vance',
    guestCount: 3,
    activeOrderId: 'ORD-8942',
    totalBill: 46.50,
    seatedMinutes: 18
  },
  {
    tableNumber: '03',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '04',
    section: 'Indoor Main Hall',
    capacity: 6,
    status: 'seated',
    serverName: 'Elena Vance',
    guestCount: 5,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 8
  },
  {
    tableNumber: '05',
    section: 'Florentine Garden Terrace',
    capacity: 2,
    status: 'call_waiter',
    serverName: 'Elena Vance',
    guestCount: 2,
    activeOrderId: 'ORD-8941',
    totalBill: 45.50,
    seatedMinutes: 24
  },
  {
    tableNumber: '06',
    section: 'Florentine Garden Terrace',
    capacity: 4,
    status: 'cooking',
    serverName: 'Marco P.',
    guestCount: 4,
    activeOrderId: null,
    totalBill: 82.00,
    seatedMinutes: 32
  },
  {
    tableNumber: '07',
    section: 'Florentine Garden Terrace',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '08',
    section: 'Florentine Garden Terrace',
    capacity: 4,
    status: 'cooking',
    serverName: 'Elena Vance',
    guestCount: 4,
    activeOrderId: 'ORD-8940',
    totalBill: 58.00,
    seatedMinutes: 14
  },
  {
    tableNumber: '09',
    section: 'Florentine Garden Terrace',
    capacity: 6,
    status: 'bill_requested',
    serverName: 'Elena Vance',
    guestCount: 5,
    activeOrderId: null,
    totalBill: 124.00,
    seatedMinutes: 48
  },
  {
    tableNumber: '10',
    section: 'Indoor Main Hall',
    capacity: 2,
    status: 'available',
    serverName: 'Unassigned',
    guestCount: 0,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 0
  },
  {
    tableNumber: '11',
    section: 'Indoor Main Hall',
    capacity: 4,
    status: 'seated',
    serverName: 'Matteo R.',
    guestCount: 3,
    activeOrderId: null,
    totalBill: 0,
    seatedMinutes: 5
  },
  {
    tableNumber: '12',
    section: 'Florentine Garden Terrace',
    capacity: 2,
    status: 'ready',
    serverName: 'Elena Vance',
    guestCount: 2,
    activeOrderId: 'ORD-8939',
    totalBill: 26.00,
    seatedMinutes: 28
  }
];

export const INITIAL_BILL_REQUESTS = [
  {
    id: 'bill-1',
    tableNumber: '09',
    guestCount: 5,
    serverName: 'Elena Vance',
    subtotal: 110.00,
    tax: 5.50,
    vat: 8.50,
    grandTotal: 124.00,
    paymentMethod: 'Credit Card',
    splitRequested: false,
    requestedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'pending' // 'pending' | 'settled'
  },
  {
    id: 'bill-2',
    tableNumber: '14',
    guestCount: 2,
    serverName: 'Luca B.',
    subtotal: 35.00,
    tax: 1.75,
    vat: 2.80,
    grandTotal: 39.55,
    paymentMethod: 'Apple Pay / Contactless',
    splitRequested: true,
    requestedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];
