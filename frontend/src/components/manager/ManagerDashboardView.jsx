import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../../context/OrderContext';
import {
  INITIAL_PROTOTYPE_ORDERS,
  INITIAL_PROTOTYPE_TABLES,
  INITIAL_PROTOTYPE_BILLS,
  INITIAL_PROTOTYPE_EMPLOYEES,
  INITIAL_PROTOTYPE_AUDIT_LOGS,
} from '../../data/restaurantPrototypeData';
import { formatInvoiceAmount } from '../../utils/formatters';
import ActionConfirmationModal from '../common/ActionConfirmationModal';
import {
  Clock,
  RefreshCw,
  AlertTriangle,
  Receipt,
  AlertCircle,
  PackageX,
  MessageSquareWarning,
  CheckCircle,
  X,
  Eye,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Wrench
} from 'lucide-react';

const ManagerDashboardView = () => {
  const {
    issuesList,
    updateIssueWorkflow,
    kitchenLoad,
    updateKitchenLoadStatus,
    feedbacksList,
    updateFeedbackStatus,
    ugcSubmissions,
    updateUgcPermission,
    removalRequests,
    updateRemovalRequestStatus,
    customerMembership,
  } = useOrder();

  const [retentionTab, setRetentionTab] = useState('FEEDBACK'); // 'RELATIONSHIPS', 'FEEDBACK', 'COMMUNITY_CONTENT'

  const [lastUpdated, setLastUpdated] = useState('7:24 PM');
  const [orders, setOrders] = useState(INITIAL_PROTOTYPE_ORDERS);
  const [tables, setTables] = useState(INITIAL_PROTOTYPE_TABLES);
  const [bills, setBills] = useState(INITIAL_PROTOTYPE_BILLS);
  const [employees, setEmployees] = useState(INITIAL_PROTOTYPE_EMPLOYEES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_PROTOTYPE_AUDIT_LOGS);
  const [outOfStockItems, setOutOfStockItems] = useState([
    { id: 'dish-006', name: 'Medu Vada', category: 'Appetizers', state: 'Temporarily Unavailable', lastUpdated: '6:45 PM', updatedBy: 'Chef Arjun Rao' },
    { id: 'dish-007', name: 'Elaneer Payasam', category: 'Desserts', state: 'Limited', lastUpdated: '6:30 PM', updatedBy: 'Sneha Patel' },
    { id: 'dish-010', name: 'Rava Onion Dosa', category: 'Dosas', state: 'Sold Out', lastUpdated: '5:50 PM', updatedBy: 'Chef Arjun Rao' },
  ]);

  const [activeDrawer, setActiveDrawer] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Issue Action Modal state
  const [selectedIssueForAction, setSelectedIssueForAction] = useState(null);
  const [assigneeName, setAssigneeName] = useState('Rahul Sharma (Waiter)');
  const [recoveryActionText, setRecoveryActionText] = useState('');

  // Safety Confirmation Modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    affectedRecord: '',
    consequenceExplanation: '',
    requiredPermission: '',
    confirmAction: null,
    reasons: []
  });

  const [notificationBanner, setNotificationBanner] = useState('');

  const handleRefreshData = () => {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLastUpdated(timeStr);
    setNotificationBanner(`Prototype operational data refreshed at ${timeStr}`);
    setTimeout(() => setNotificationBanner(''), 3000);
  };

  const handleRestoreStock = (itemId) => {
    setOutOfStockItems(prev => prev.filter(i => i.id !== itemId));
    const newLog = {
      actionId: `AUD-${Date.now()}`,
      actionType: 'STOCK_RESTORED',
      entityType: 'MENU_ITEM',
      entityId: itemId,
      entityLabel: itemId,
      reason: 'Fresh batch prepared',
      note: 'Restored availability in menu',
      performedBy: 'Manager Demo',
      performedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setNotificationBanner('Item availability restored successfully.');
    setTimeout(() => setNotificationBanner(''), 3000);
  };

  const initiateCloseTableSession = (table) => {
    const linkedOrder = orders.find(o => o.tableNumber === table.tableNumber && o.paymentStatus !== 'PAID');
    const linkedBill = bills.find(b => b.tableNumber === table.tableNumber && b.status !== 'PAID');

    if (linkedBill || (linkedOrder && linkedOrder.paymentStatus === 'UNPAID')) {
      alert(`This table cannot be closed because Bill #${linkedBill?.billId || linkedOrder?.billId || '1048'} is still unpaid.`);
      return;
    }

    setConfirmationModal({
      isOpen: true,
      title: `Close Session for Table ${table.tableNumber}?`,
      affectedRecord: `Table ${table.tableNumber} (${table.status})`,
      consequenceExplanation: 'This will reset the table status to Available and clear active seating assignments.',
      requiredPermission: 'TABLE_CLOSE',
      reasons: [
        'Guest departed after payment',
        'Manual session cleanup',
        'Reservation cancelled',
        'Duplicate seating record'
      ],
      confirmAction: (formData) => {
        setTables(prev => prev.map(t => t.tableId === table.tableId ? { ...t, status: 'Available', guestCount: 0, currentOrderId: null, assignedWaiter: null } : t));
        const newLog = {
          actionId: `AUD-${Date.now()}`,
          actionType: 'TABLE_SESSION_CLOSED',
          entityType: 'TABLE',
          entityId: table.tableId,
          entityLabel: `Table ${table.tableNumber}`,
          reason: formData.reason,
          note: formData.note,
          performedBy: formData.performedBy,
          performedAt: formData.timestamp
        };
        setAuditLogs(prev => [newLog, ...prev]);
      }
    });
  };

  const handleApplyIssueAction = () => {
    if (!selectedIssueForAction) return;
    updateIssueWorkflow(selectedIssueForAction.issueId, {
      assignedOwner: assigneeName,
      status: 'ACTION_IN_PROGRESS',
      statusLabel: 'Action in progress',
      recoveryAction: recoveryActionText || 'Replacement being prepared by kitchen'
    });
    setNotificationBanner(`Staff owner assigned to Issue ${selectedIssueForAction.issueId}`);
    setSelectedIssueForAction(null);
    setTimeout(() => setNotificationBanner(''), 3000);
  };

  // Sort issues by priority: Allergy & Billing first
  const sortedIssues = [...(issuesList || [])].sort((a, b) => {
    const priorityRank = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (priorityRank[a.priority] || 2) - (priorityRank[b.priority] || 2);
  });

  const delayedOrders = orders.filter(o => o.isDelayed || o.elapsedMinutes > 30);
  const mismatchOrder = orders.find(o => o.paymentStatus === 'MISMATCH');

  return (
    <div className="space-y-8 pb-12">
      {/* Flash Banner */}
      <AnimatePresence>
        {notificationBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary text-on-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {notificationBanner}
            </span>
            <button onClick={() => setNotificationBanner('')}><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Operational Header & Kitchen Load Status Switcher */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              Restaurant Operations &amp; Recovery
            </h2>
            <span className="inline-flex items-center bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide">
              Prototype Dataset
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-on-surface-variant font-medium">
            <span className="font-semibold text-on-surface">Kitchen Load: <strong>{kitchenLoad?.status}</strong></span>
            <span>&bull;</span>
            <span>Last updated {lastUpdated}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 flex gap-1">
            {['NORMAL', 'BUSY', 'VERY_BUSY', 'PAUSED'].map((st) => (
              <button
                key={st}
                onClick={() => updateKitchenLoadStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  kitchenLoad?.status === st
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefreshData}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-xs font-bold text-on-surface flex items-center gap-2 transition-all active:scale-95 shadow-xs shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Priority Alert Strip */}
      <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-3">
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Priority Operations Alerts</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white"><Clock className="w-4 h-4" /></div>
            <div>
              <span className="text-lg font-extrabold text-amber-700 dark:text-amber-300 block leading-none">{delayedOrders.length}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Delayed Orders</span>
            </div>
          </div>

          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500 text-white"><Receipt className="w-4 h-4" /></div>
            <div>
              <span className="text-lg font-extrabold text-rose-700 dark:text-rose-300 block leading-none">2</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Pending Bills &gt; 20m</span>
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600 text-white"><AlertCircle className="w-4 h-4" /></div>
            <div>
              <span className="text-lg font-extrabold text-purple-700 dark:text-purple-300 block leading-none">1</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Payment Mismatch</span>
            </div>
          </div>

          <div className="bg-slate-500/10 border border-slate-500/30 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700 text-white"><PackageX className="w-4 h-4" /></div>
            <div>
              <span className="text-lg font-extrabold text-slate-800 dark:text-stone-200 block leading-none">{outOfStockItems.length}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Out-of-Stock</span>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2 rounded-lg bg-red-600 text-white"><MessageSquareWarning className="w-4 h-4" /></div>
            <div>
              <span className="text-lg font-extrabold text-red-700 dark:text-red-300 block leading-none">{sortedIssues.length}</span>
              <span className="text-[11px] font-semibold text-on-surface-variant">Active Issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Service Recovery & Customer Issue Management (Main Focus) */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-rose-500/30 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-rose-600" />
              Service Recovery Workflow &amp; Customer Complaints
            </h3>
            <p className="text-xs text-on-surface-variant">Prioritizes allergy concerns, billing issues, delays, and unowned complaints.</p>
          </div>
          <span className="text-xs font-extrabold bg-rose-500/10 text-rose-700 px-3 py-1 rounded-full border border-rose-500/30">
            {sortedIssues.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length} Unresolved
          </span>
        </div>

        <div className="space-y-3">
          {sortedIssues.map((iss) => (
            <div
              key={iss.issueId}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                iss.priority === 'HIGH' ? 'bg-rose-500/5 border-rose-500/30' : 'bg-surface-container-low border-outline-variant/30'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-extrabold text-sm text-on-surface">Ticket #{iss.issueId}</span>
                  <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                    Table {iss.tableNumber} (Order #{iss.orderId})
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    iss.priority === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {iss.categoryLabel}
                  </span>
                  <span className="text-[11px] font-semibold text-on-surface-variant">
                    Status: <strong className="text-on-surface">{iss.statusLabel || iss.status}</strong>
                  </span>
                </div>

                <p className="text-xs font-semibold text-on-surface leading-snug">
                  Item: <strong className="text-primary">{iss.affectedItemName || 'General Order'}</strong> — {iss.description || 'Customer reported an issue.'}
                </p>

                <div className="text-[11px] text-on-surface-variant flex flex-wrap items-center gap-3 pt-1">
                  <span>Assigned Owner: <strong className="text-on-surface">{iss.assignedOwner}</strong></span>
                  <span>&bull;</span>
                  <span>Reported at {iss.reportedAt}</span>
                  <span>&bull;</span>
                  <span>Customer confirmation: <strong className={iss.customerConfirmed ? 'text-emerald-600' : 'text-amber-700'}>
                    {iss.customerConfirmed ? 'Confirmed Resolved' : 'Pending Confirmation'}
                  </strong></span>
                </div>

                {iss.recoveryAction && (
                  <div className="mt-2 p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-xs text-on-surface">
                    <strong>Recovery Action:</strong> {iss.recoveryAction}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0 sm:w-48">
                <button
                  onClick={() => {
                    setSelectedIssueForAction(iss);
                    setRecoveryActionText(iss.recoveryAction || 'Replacement being prepared by kitchen');
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Assign &amp; Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Live Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <div>
              <h3 className="text-lg font-bold text-on-surface">Live Orders</h3>
              <p className="text-xs text-on-surface-variant">Active kitchen and dining floor transactions</p>
            </div>
            <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {orders.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.orderId}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-on-surface">Order #{ord.orderId.replace('ORD-', '')}</span>
                    <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      Table {ord.tableNumber}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      ord.orderStatus === 'PREPARING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      ord.orderStatus === 'BILL_REQUESTED' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-3 pt-1">
                    <span>Waiter: <strong className="text-on-surface">{ord.assignedWaiter}</strong></span>
                    <span>&bull;</span>
                    <span>Placed {ord.placedAt}</span>
                    <span>&bull;</span>
                    <span>Est. Ready {ord.estimatedReadyAt}</span>
                    <span>&bull;</span>
                    <span className="font-mono text-primary font-bold">{formatInvoiceAmount(ord.total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedItemDetail(ord);
                    setActiveDrawer('order-detail');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-bold text-primary hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Order</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delayed Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-amber-500/30 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-on-surface">Delayed Orders</h3>
            </div>
            <span className="text-xs font-extrabold bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full">
              {delayedOrders.length} Alert
            </span>
          </div>

          <div className="space-y-3">
            {delayedOrders.map((dOrd) => (
              <div key={dOrd.orderId} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-amber-900 dark:text-amber-200">Order #{dOrd.orderId.replace('ORD-', '')}</span>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Table {dOrd.tableNumber}</span>
                </div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Expected {dOrd.elapsedMinutes - 20} minutes ago
                </p>
                <div className="text-[11px] text-on-surface-variant space-y-0.5 pt-1">
                  <div>Kitchen Status: <strong className="text-on-surface">{dOrd.kitchenStatus}</strong></div>
                  <div>Assigned waiter: <strong className="text-on-surface">{dOrd.assignedWaiter}</strong></div>
                  {dOrd.delayReason && <div className="italic text-amber-700 pt-1">Note: {dOrd.delayReason}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Table Status Grid */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Table Status Overview</h3>
            <p className="text-xs text-on-surface-variant">Live dining floor state &amp; seating assignments</p>
          </div>
          <span className="text-xs font-medium text-on-surface-variant">
            {tables.filter(t => t.status !== 'Available').length} / {tables.length} Occupied
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map((t) => {
            const isOccupied = t.status !== 'Available' && t.status !== 'Cleaning';
            return (
              <div
                key={t.tableId}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                  t.status === 'Available' ? 'bg-surface-container-lowest border-outline-variant/40' :
                  t.status === 'Bill Requested' ? 'bg-purple-500/10 border-purple-500/40' :
                  t.status === 'Food Preparing' ? 'bg-amber-500/10 border-amber-500/40' :
                  t.status === 'Reserved' ? 'bg-blue-500/10 border-blue-500/40' :
                  'bg-surface-container-low border-outline-variant/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-sm text-on-surface">Table {t.tableNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      t.status === 'Bill Requested' ? 'bg-purple-200 text-purple-900' :
                      'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-on-surface-variant mt-2 space-y-0.5">
                    <div>Guests: <strong>{t.guestCount || '-'}</strong></div>
                    {t.currentOrderId && <div>Order: <strong>#{t.currentOrderId.replace('ORD-', '')}</strong></div>}
                    {t.assignedWaiter && <div>Waiter: <strong>{t.assignedWaiter}</strong></div>}
                    <div className="text-[10px] text-on-surface-variant/70 pt-0.5">In state: {t.timeInState}</div>
                  </div>
                </div>

                {isOccupied && (
                  <button
                    onClick={() => initiateCloseTableSession(t)}
                    className="w-full py-1.5 rounded-xl bg-surface-container hover:bg-error/10 hover:text-error text-on-surface-variant text-[11px] font-bold border border-outline-variant/40 transition-colors"
                  >
                    Close Session
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Connected Customer Retention & Engagement Systems */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Guest Relationships &amp; Engagement Operations
            </h3>
            <p className="text-xs text-on-surface-variant">
              Manage operational feedback, ethical loyalty milestones, customer content permissions, and privacy removal requests.
            </p>
          </div>

          <div className="flex bg-surface-container-high p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setRetentionTab('FEEDBACK')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                retentionTab === 'FEEDBACK' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Feedback Operations ({feedbacksList.length})
            </button>
            <button
              onClick={() => setRetentionTab('RELATIONSHIPS')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                retentionTab === 'RELATIONSHIPS' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Guest Relationships
            </button>
            <button
              onClick={() => setRetentionTab('COMMUNITY_CONTENT')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                retentionTab === 'COMMUNITY_CONTENT' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Community Content ({ugcSubmissions.length})
            </button>
          </div>
        </div>

        {/* Section 1: Feedback Operations */}
        {retentionTab === 'FEEDBACK' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Guest Feedback Requiring Operational Review
              </h4>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Negative ratings (1-2★) &amp; service concerns are routed privately for manager review
              </span>
            </div>

            <div className="space-y-3">
              {feedbacksList.map((fdb) => (
                <div
                  key={fdb.feedbackId}
                  className={`p-4 rounded-2xl border transition-all ${
                    fdb.feedbackRoute === 'PRIVATE_MANAGER_REVIEW'
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-surface border-outline-variant/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-primary">#{fdb.feedbackId}</span>
                      <span className="text-on-surface-variant">&bull;</span>
                      <span className="font-semibold text-on-surface">Order #{fdb.orderId}</span>
                      <span className="text-on-surface-variant">&bull;</span>
                      <span className="text-on-surface-variant">Table {fdb.tableNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        fdb.feedbackRoute === 'PRIVATE_MANAGER_REVIEW'
                          ? 'bg-amber-500/20 text-amber-900 border border-amber-500/40'
                          : 'bg-emerald-500/10 text-emerald-800'
                      }`}>
                        {fdb.feedbackRoute === 'PRIVATE_MANAGER_REVIEW' ? 'Private Manager Review' : 'Standard Log'}
                      </span>
                      <span className="text-[11px] font-semibold text-on-surface-variant">{fdb.submittedAt}</span>
                    </div>
                  </div>

                  {/* Operational Category Ratings */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-3 text-xs">
                    <div className="bg-surface-container-low p-2 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant font-bold block uppercase">Food Quality</span>
                      <span className="font-bold text-primary">{fdb.ratings?.food || 4}/5</span>
                    </div>
                    <div className="bg-surface-container-low p-2 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant font-bold block uppercase">Service</span>
                      <span className="font-bold text-primary">{fdb.ratings?.service || 4}/5</span>
                    </div>
                    <div className="bg-surface-container-low p-2 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant font-bold block uppercase">Speed</span>
                      <span className={`font-bold ${fdb.ratings?.speed <= 2 ? 'text-rose-700 font-extrabold' : 'text-primary'}`}>
                        {fdb.ratings?.speed || 3}/5
                      </span>
                    </div>
                    <div className="bg-surface-container-low p-2 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant font-bold block uppercase">Cleanliness</span>
                      <span className="font-bold text-primary">{fdb.ratings?.cleanliness || 5}/5</span>
                    </div>
                    <div className="bg-surface-container-low p-2 rounded-xl">
                      <span className="text-[10px] text-on-surface-variant font-bold block uppercase">Value</span>
                      <span className="font-bold text-primary">{fdb.ratings?.value || 4}/5</span>
                    </div>
                  </div>

                  {/* Details & Notes */}
                  <div className="text-xs space-y-1.5 text-on-surface">
                    {fdb.memorableDishName && (
                      <p><strong>Memorable Dish:</strong> {fdb.memorableDishName}</p>
                    )}
                    {fdb.improvementCategoriesLabels?.length > 0 && (
                      <p className="text-rose-800 font-semibold">
                        <strong>Improvement Areas:</strong> {fdb.improvementCategoriesLabels.join(', ')}
                      </p>
                    )}
                    {fdb.comment && (
                      <p className="italic bg-surface-container-lowest p-2.5 rounded-xl border border-outline-variant/20">
                        &quot;{fdb.comment}&quot;
                      </p>
                    )}
                  </div>

                  {/* Workflow Actions */}
                  <div className="mt-3 pt-3 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-on-surface">Status:</span>
                      <select
                        value={fdb.status}
                        onChange={(e) => {
                          updateFeedbackStatus(fdb.feedbackId, e.target.value);
                          setNotificationBanner(`Feedback #${fdb.feedbackId} status updated to ${e.target.value}`);
                          setTimeout(() => setNotificationBanner(''), 3000);
                        }}
                        className="px-2.5 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg font-semibold text-xs"
                      >
                        <option value="New">New</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Contacted Guest">Contacted Guest</option>
                        <option value="Action Recorded">Action Recorded</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-on-surface-variant italic">
                      {fdb.managerNotes || 'Assigned to Shift Manager Ananya Reddy'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Guest Relationships & Milestones */}
        {retentionTab === 'RELATIONSHIPS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                <span className="font-bold text-amber-900 uppercase tracking-wider block">Community Status</span>
                <p className="text-lg font-bold text-primary">{customerMembership?.statusLevel || 'Regular Guest'}</p>
                <p className="text-on-surface-variant">{customerMembership?.statusEarnedReason || 'Recognized after 5 completed visits.'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
                <span className="font-bold text-primary uppercase tracking-wider block">Upcoming Celebration</span>
                <p className="text-sm font-bold text-on-surface">
                  {customerMembership?.celebrationPreferences?.occasionType || 'Birthday'} · Day {customerMembership?.celebrationPreferences?.day || 14}/08
                </p>
                <p className="text-on-surface-variant italic">
                  Note: &quot;{customerMembership?.celebrationPreferences?.guestNote || 'Window bay table preferred'}&quot;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
                <span className="font-bold text-primary uppercase tracking-wider block">Favourite Dish Alert Interests</span>
                <div className="space-y-1">
                  {(customerMembership?.favouriteDishAlerts || [
                    { dishName: 'Masala Dosa', preferenceChannel: 'In-app' },
                    { dishName: 'Filter Coffee', preferenceChannel: 'In-app' }
                  ]).map((al, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="font-medium text-on-surface">{al.dishName}</span>
                      <span className="font-bold text-secondary">{al.preferenceChannel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-outline-variant/30 space-y-2 text-xs">
              <h4 className="font-bold text-primary uppercase tracking-wider">Active Hospitality Benefits</h4>
              {(customerMembership?.activeHospitalityBenefits || []).map((ben) => (
                <div key={ben.benefitId} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                  <div>
                    <span className="font-bold text-on-surface">{ben.title}</span>
                    <p className="text-[11px] text-on-surface-variant">{ben.description}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    ben.status === 'Redeemed' ? 'bg-emerald-500/10 text-emerald-800' : 'bg-amber-500/15 text-amber-900'
                  }`}>
                    {ben.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Community Content & Customer Privacy Permissions */}
        {retentionTab === 'COMMUNITY_CONTENT' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Customer Content Permissions ({ugcSubmissions.length} Submissions)
              </h4>

              <div className="space-y-3">
                {ugcSubmissions.map((ugc) => {
                  const repostAllowed = ugc.permissions?.restaurantRepostAllowed === true;

                  return (
                    <div key={ugc.participationId} className="p-4 rounded-2xl bg-surface border border-outline-variant/30 text-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">#{ugc.participationId}</span>
                          <span className="text-on-surface-variant">&bull;</span>
                          <span className="font-semibold text-on-surface">Dish: {ugc.dishName}</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant font-medium">Granted: {ugc.permissionGrantedAt}</span>
                      </div>

                      <div className="flex gap-3 items-center">
                        <img
                          src={ugc.mediaPreview}
                          alt="Customer upload preview"
                          className="w-16 h-16 rounded-xl object-cover border border-outline-variant"
                        />
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold text-on-surface">&quot;{ugc.captionText}&quot;</p>
                          <p className="text-[11px] text-on-surface-variant">
                            Display Name: <strong>{ugc.permissions?.displayNameAllowed ? ugc.displayName : 'Verified Guest'}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Repost Permission Badge & Enforced Button */}
                      <div className="pt-2 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-on-surface">Repost Status:</span>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            repostAllowed
                              ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-500/10 text-rose-800 border border-rose-300'
                          }`}>
                            {repostAllowed ? 'Reposting Permitted' : 'Customer upload — Reposting not permitted'}
                          </span>
                        </div>

                        <button
                          disabled={!repostAllowed}
                          onClick={() => {
                            if (repostAllowed) {
                              setNotificationBanner(`Mock repost triggered for #${ugc.participationId}`);
                              setTimeout(() => setNotificationBanner(''), 3000);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            repostAllowed
                              ? 'bg-primary text-on-primary shadow-xs hover:bg-primary/90'
                              : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed border border-outline-variant/30'
                          }`}
                        >
                          {repostAllowed ? 'Mock Repost Content' : 'Reposting Disabled by Customer'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Removal Requests Management Table */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                Customer Content Removal Requests ({removalRequests.length})
              </h4>

              <div className="space-y-2">
                {removalRequests.map((req) => (
                  <div key={req.requestId} className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 text-xs space-y-2">
                    <div className="flex justify-between items-center font-bold text-on-surface">
                      <span>#{req.requestId} · {req.requestReasonLabel}</span>
                      <select
                        value={req.status}
                        onChange={(e) => {
                          updateRemovalRequestStatus(req.requestId, e.target.value);
                          setNotificationBanner(`Removal request #${req.requestId} status set to ${e.target.value}`);
                          setTimeout(() => setNotificationBanner(''), 3000);
                        }}
                        className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs font-bold"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Removed">Removed</option>
                        <option value="Clarification Needed">Clarification Needed</option>
                      </select>
                    </div>

                    <p className="text-[11px] text-on-surface-variant">{req.details || 'Customer requested permission withdrawal.'}</p>
                    <p className="text-[10px] text-outline">Submitted: {req.submittedAt} · Reviewed by Ananya Reddy</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Ownership Assignment Modal */}
      {selectedIssueForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 max-w-md w-full space-y-4 text-on-surface shadow-2xl">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-rose-700">
                <Wrench className="w-5 h-5" />
                Assign Staff Owner &amp; Action
              </h3>
              <button onClick={() => setSelectedIssueForAction(null)} className="p-1 text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p>Assign staff owner and set selected recovery action for Issue <strong>#{selectedIssueForAction.issueId}</strong> (Table {selectedIssueForAction.tableNumber}).</p>

              <div>
                <label className="block font-bold text-on-surface mb-1">Select Staff Owner</label>
                <select
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-xl font-semibold outline-none"
                >
                  <option value="Rahul Sharma (Waiter)">Rahul Sharma (Waiter)</option>
                  <option value="Ananya Reddy (Shift Manager)">Ananya Reddy (Shift Manager)</option>
                  <option value="Imran Khan (Counter Staff)">Imran Khan (Counter Staff)</option>
                  <option value="Chef Arjun Rao (Head Chef)">Chef Arjun Rao (Head Chef)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Recovery Action</label>
                <textarea
                  rows={3}
                  value={recoveryActionText}
                  onChange={(e) => setRecoveryActionText(e.target.value)}
                  placeholder="e.g. Replacement Masala Dosa being prepared by kitchen. ETA 12 minutes."
                  className="w-full p-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIssueForAction(null)}
                className="px-4 py-2 bg-surface-container text-on-surface font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyIssueAction}
                className="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow"
              >
                Save Ownership &amp; Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Confirmation Modal */}
      <ActionConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={(formData) => {
          if (confirmationModal.confirmAction) {
            confirmationModal.confirmAction(formData);
          }
          setNotificationBanner('Action executed and activity audit logged successfully.');
          setTimeout(() => setNotificationBanner(''), 3000);
        }}
        title={confirmationModal.title}
        affectedRecord={confirmationModal.affectedRecord}
        consequenceExplanation={confirmationModal.consequenceExplanation}
        requiredPermission={confirmationModal.requiredPermission}
        currentRole="MANAGER"
        reasons={confirmationModal.reasons}
      />
    </div>
  );
};

export default ManagerDashboardView;
