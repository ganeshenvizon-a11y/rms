import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Printer,
  Eye,
  ListOrdered,
  CheckCircle2,
  Activity,
  ArrowUpDown
} from 'lucide-react';

const STATUS_META = {
  received: { label: 'New', badge: 'bg-error-container text-on-error-container' },
  preparing: { label: 'Preparing', badge: 'bg-secondary-container text-on-secondary-fixed' },
  ready: { label: 'Ready', badge: 'bg-emerald-100 text-emerald-700' },
  served: { label: 'Completed', badge: 'bg-green-100 text-green-700' },
};

const STATUS_FILTERS = [
  { id: 'all', label: 'All Status' },
  { id: 'received', label: 'New' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Completed' },
];

const formatDateTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const elapsedLabel = (isoString) => {
  const minutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const OrderHistoryScreen = ({ orders = [] }) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortLatestFirst, setSortLatestFirst] = useState(true);

  const totalOrders = orders.length;
  const completedTodayCount = orders.filter((o) => o.status === 'served').length;
  const activeNowCount = orders.filter((o) => o.status !== 'served').length;

  const visibleOrders = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== 'all') {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.tableNumber.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const diff = new Date(a.createdAt) - new Date(b.createdAt);
      return sortLatestFirst ? -diff : diff;
    });

    return list;
  }, [orders, statusFilter, searchQuery, sortLatestFirst]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Order History</h1>
          <p className="text-sm text-on-surface-variant">
            Review kitchen tickets across every status —{' '}
            <span className="text-primary font-bold">{totalOrders} total orders</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 text-primary flex items-center justify-center shrink-0">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wide">Total Orders</p>
            <p className="text-2xl font-bold text-on-surface">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-on-surface">{completedTodayCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary-container/40 text-on-secondary-fixed flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wide">Active Now</p>
            <p className="text-2xl font-bold text-on-surface">{activeNowCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Table, or Item..."
            className="w-full h-11 pl-10 pr-4 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-on-surface-variant/60"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 pl-4 pr-9 bg-surface-container rounded-lg text-sm font-medium appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" />
        </div>

        <button
          onClick={() => setSortLatestFirst((v) => !v)}
          className="h-11 px-4 flex items-center gap-2 bg-surface-container rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors shrink-0"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortLatestFirst ? 'Latest First' : 'Oldest First'}
        </button>
      </div>

      {/* Order List */}
      <div className="space-y-3">
        {visibleOrders.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-outline-variant/60 rounded-xl">
            <p className="text-sm text-on-surface-variant">No orders match your filters.</p>
          </div>
        )}

        {visibleOrders.map((order) => {
          const isExpanded = expandedId === order.orderId;
          const statusMeta = STATUS_META[order.status] || STATUS_META.received;

          return (
            <div
              key={order.orderId}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.orderId)}
                className="w-full p-5 flex flex-wrap items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-5 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Order ID</span>
                    <span className="font-black text-on-surface">#{order.orderId}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-outline-variant" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Table</span>
                    <span className="font-bold text-on-surface">{order.tableNumber}</span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-outline-variant" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Date &amp; Time</span>
                    <span className="text-sm font-medium text-on-surface">{formatDateTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusMeta.badge}`}>
                    {statusMeta.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-on-surface-variant transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-outline-variant/50 p-5 bg-surface-container/40 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Ordered Items</h4>
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span>
                            <span className="text-primary font-bold">{item.quantity}x</span> {item.name}
                          </span>
                          <span className="text-on-surface-variant text-xs">{item.station}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase block mb-1">Placed At</span>
                        <span className="text-sm font-bold text-on-surface">{formatDateTime(order.createdAt)}</span>
                      </div>
                      <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase block mb-1">
                          {order.status === 'served' ? 'Total Time' : 'Elapsed'}
                        </span>
                        <span className="text-sm font-bold text-on-surface">{elapsedLabel(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 h-11 bg-surface-container-lowest border border-outline-variant text-on-surface font-bold rounded-lg text-sm hover:bg-surface-container transition-all flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                      <button
                        onClick={() => navigate(`/kitchen/orders/${order.orderId}`)}
                        className="flex-1 h-11 bg-primary text-on-primary font-bold rounded-lg text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistoryScreen;
