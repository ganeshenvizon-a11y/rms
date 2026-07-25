import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../hooks/useToast';
import { REPORTS_MOCK_DATA, getStoredEmployees } from '../../services/managerService';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  TrendingUp,
  Download,
  Star,
  Truck,
  CookingPot,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const DONUT_SEGMENTS = [
  { key: 'food', label: 'Food', color: 'var(--color-primary)' },
  { key: 'drinks', label: 'Drinks', color: 'var(--color-secondary-container)' },
  { key: 'desserts', label: 'Desserts', color: 'var(--color-tertiary)' },
];

const STATUS_BADGE = {
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-yellow-100 text-yellow-700',
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} hr ago`;
};

const ManagerDashboardView = ({ onNavigateTab }) => {
  const { kitchenOrders, waiterTables, receipts, billRequests, assistanceRequests } = useOrder();
  const { showToast } = useToast();
  const [employees] = useState(() => getStoredEmployees());
  const [salesTimeframe, setSalesTimeframe] = useState('today');

  const dynamicSales = receipts.reduce((sum, r) => sum + (r.grandTotal || 0), 4850.75);
  const ordersToday = kitchenOrders.length;
  const totalTables = waiterTables.length || 12;
  const occupiedTables = waiterTables.filter((t) => t.status !== 'available').length;
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100);
  const activeTicketsCount = kitchenOrders.filter((o) => o.status !== 'served').length;
  const kitchenLoad = Math.min(100, Math.round((activeTicketsCount / Math.max(totalTables, 1)) * 100));
  const pendingBills = billRequests.filter((b) => b.status === 'pending').length;
  const clockedInStaffCount = employees.filter((e) => e.status === 'Clocked In').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const categoryBuckets = REPORTS_MOCK_DATA.categoryPerformance.reduce(
    (acc, cat) => {
      if (cat.name.includes('Coffee') || cat.name.includes('Drinks')) acc.drinks += cat.sales;
      else if (cat.name.includes('Sweets') || cat.name.includes('Payasam')) acc.desserts += cat.sales;
      else acc.food += cat.sales;
      return acc;
    },
    { food: 0, drinks: 0, desserts: 0 }
  );
  const bucketTotal = categoryBuckets.food + categoryBuckets.drinks + categoryBuckets.desserts || 1;
  const bucketPercents = DONUT_SEGMENTS.map((seg) => ({
    ...seg,
    percent: Math.round((categoryBuckets[seg.key] / bucketTotal) * 100),
  }));
  let cumulative = 0;
  const conicStops = bucketPercents
    .map((seg) => {
      const start = cumulative;
      cumulative += seg.percent;
      return `${seg.color} ${start}% ${cumulative}%`;
    })
    .join(', ');

  const maxDishQty = Math.max(...REPORTS_MOCK_DATA.topDishes.map((d) => d.quantity), 1);
  const maxHourlySales = Math.max(...REPORTS_MOCK_DATA.hourlyTraffic.map((h) => h.sales), 1);

  const liveFeed = [
    {
      icon: CookingPot,
      color: 'text-primary bg-primary/10',
      title: kitchenOrders[0] ? `New Ticket — Table ${kitchenOrders[0].tableNumber}` : 'No active kitchen tickets',
      detail: kitchenOrders[0] ? `${kitchenOrders[0].items.length} items • ${timeAgo(kitchenOrders[0].createdAt)}` : 'Kitchen queue is clear',
    },
    {
      icon: Truck,
      color: 'text-secondary bg-secondary-container/20',
      title: 'Pantry Restock Logged',
      detail: 'Fresh vegetables & dairy arrived this morning',
    },
    {
      icon: ShieldCheck,
      color: 'text-green-700 bg-green-100',
      title: assistanceRequests.some((r) => r.status === 'resolved') ? 'Assistance Request Resolved' : 'Floor Running Smoothly',
      detail: `${clockedInStaffCount} of ${employees.length} staff clocked in`,
    },
    {
      icon: Star,
      color: 'text-blue-700 bg-blue-100',
      title: `${RESTAURANT_INFO.rating} ★ Average Rating`,
      detail: `${RESTAURANT_INFO.reviewsCount.toLocaleString()} guest reviews`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">{greeting}, Sundaram</h2>
          <p className="text-on-surface-variant mt-1">Here is what's happening at {RESTAURANT_INFO.name} today.</p>
        </div>
        <button
          onClick={() => showToast('Daily report exported to downloads', 'success')}
          className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Daily Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Today's Revenue</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">₹{dynamicSales.toFixed(2)}</h3>
          <div className="flex items-center gap-1 mt-2 text-green-600 font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            +12.4% <span className="text-on-surface-variant/60 font-normal ml-1">vs yesterday</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Orders Today</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{ordersToday}</h3>
          <div className="flex items-center gap-1 mt-2 text-green-600 font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            +8.2% <span className="text-on-surface-variant/60 font-normal ml-1">vs yesterday</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Tables</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{occupiedTables} / {totalTables}</h3>
          <div className="w-full bg-surface-container mt-3 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary-container h-full" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kitchen Load</p>
          <h3 className={`text-2xl font-bold mt-2 ${kitchenLoad > 80 ? 'text-primary' : 'text-on-surface'}`}>{kitchenLoad}%</h3>
          <p className={`text-xs font-semibold mt-2 ${kitchenLoad > 80 ? 'text-error' : 'text-on-surface-variant'}`}>
            {kitchenLoad > 80 ? 'High Volume' : 'Normal Volume'}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Bills</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{pendingBills}</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">Awaiting payment</p>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Staff On Duty</p>
          <h3 className="text-2xl font-bold text-on-surface mt-2">{clockedInStaffCount}</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">of {employees.length} total staff</p>
        </div>
      </div>

      {/* Sales Trend & Revenue Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold text-on-surface">Sales Trend</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setSalesTimeframe('today')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${salesTimeframe === 'today' ? 'bg-surface-container text-on-surface' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                Hourly
              </button>
              <button
                onClick={() => setSalesTimeframe('week')}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${salesTimeframe === 'week' ? 'bg-surface-container text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                Daily
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-dashed border-outline-variant">
            {REPORTS_MOCK_DATA.hourlyTraffic.map((item, idx) => {
              const heightPercent = Math.round((item.sales / maxHourlySales) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-8 bg-inverse-surface text-inverse-on-surface text-[10px] font-mono px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-20">
                    ₹{item.sales} ({item.orders} orders)
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-primary/80 group-hover:bg-primary transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase pt-3">
            {REPORTS_MOCK_DATA.hourlyTraffic.map((item, idx) => (
              <span key={idx}>{item.hour}</span>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
          <h4 className="text-lg font-bold text-on-surface mb-8">Revenue Breakdown</h4>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{ background: `conic-gradient(${conicStops})` }}
            >
              <div className="w-32 h-32 rounded-full bg-surface-container-lowest flex items-center justify-center text-center">
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase font-bold">Total</span>
                  <span className="text-2xl font-bold text-on-surface">100%</span>
                </div>
              </div>
            </div>
            <div className="mt-8 w-full space-y-3">
              {bucketPercents.map((seg) => (
                <div key={seg.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                    <span className="text-sm font-medium text-on-surface-variant">{seg.label}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface">{seg.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-on-surface">Popular Menu Items</h4>
            <button onClick={() => onNavigateTab('menu')} className="text-xs font-bold text-primary hover:underline">
              Manage
            </button>
          </div>
          <div className="space-y-6">
            {REPORTS_MOCK_DATA.topDishes.map((dish, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-semibold text-on-surface line-clamp-1">{dish.name}</span>
                  <span className="text-xs font-bold text-on-surface-variant shrink-0">{dish.quantity} orders</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${Math.round((dish.quantity / maxDishQty) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-on-surface">Recent Orders</h4>
            <button onClick={() => onNavigateTab('reports')} className="text-sm font-bold text-primary hover:underline flex items-center gap-0.5">
              View All Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
                  <th className="py-3 px-4">Receipt</th>
                  <th className="py-3 px-4">Table</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {receipts.slice(0, 4).map((r) => (
                  <tr key={r.receiptNo} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-all">
                    <td className="py-3.5 px-4 text-on-surface">{r.receiptNo}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{r.tableNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-on-surface">₹{(r.grandTotal || 0).toFixed(2)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_BADGE[r.status] || 'bg-surface-container text-on-surface-variant'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-on-surface-variant text-sm">No orders settled yet today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-bold text-on-surface mb-6">Live Operations Feed</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveFeed.map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div key={i} className="p-4 bg-background rounded-lg border border-outline-variant/40 flex items-start gap-4">
                <div className={`p-2 rounded ${entry.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">{entry.title}</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{entry.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardView;
