import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import OrderTimeline from '../../components/order/OrderTimeline';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import { AlertCircle, Clock, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const OrderTrackingScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, updateOrderStatus, assistanceRequests, addAssistanceRequest, issuesList } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [currentStageIndex, setCurrentStageIndex] = useState(activeOrder?.stageIndex || 0);
  const [remainingSeconds, setRemainingSeconds] = useState(14 * 60);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);
  const [serveReadyFirst, setServeReadyFirst] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  // Check if active assistance request exists for table
  const activeAssistance = assistanceRequests?.find(
    (req) => req.tableNumber === tableNumber && req.status === 'pending'
  );

  const activeIssue = issuesList?.find(
    (iss) => (iss.orderId === activeOrder?.orderId || iss.tableNumber === tableNumber) && iss.status !== 'CLOSED' && iss.status !== 'RESOLVED'
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextStage = () => {
    const nextIdx = Math.min(3, currentStageIndex + 1);
    const stageNames = ['received', 'preparing', 'ready', 'served'];
    setCurrentStageIndex(nextIdx);
    updateOrderStatus(stageNames[nextIdx], nextIdx);
    showToast(`Order status updated to "${stageNames[nextIdx].toUpperCase()}"`, 'info');
  };

  const handleRequestAssistanceOption = (optionLabel) => {
    if (activeAssistance) {
      showToast('Assistance already requested. Rahul will respond shortly.', 'warning');
      setIsAssistanceModalOpen(false);
      return;
    }
    addAssistanceRequest(tableNumber, optionLabel);
    showToast(`Requested "${optionLabel}" for Table ${tableNumber}`, 'success');
    setIsAssistanceModalOpen(false);
  };

  if (!activeOrder) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="schedule" className="text-4xl" />}
            title="No active order to track"
            description="You have not placed an order yet."
            actionLabel="Browse Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
    );
  }

  const items = activeOrder.items || [];
  const readyItems = items.filter((it) => it.readinessStatus === 'READY');
  const preparingItems = items.filter((it) => it.readinessStatus !== 'READY');

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
      <TopAppBar
        variant="brand"
        onOpenTrustProfile={() => setIsTrustOpen(true)}
      />

      <main className="flex-1 pt-20 pb-28 max-w-2xl mx-auto w-full px-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-on-surface-variant">
            Order #{activeOrder.orderId || 'ORD-1048'} &bull; Table {tableNumber}
          </p>
          <button
            onClick={handleNextStage}
            className="px-3 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full text-[10px] font-bold"
          >
            Advance Demo Stage &#8594;
          </button>
        </div>

        {/* Transparent ETA Change Notice */}
        {activeOrder.etaChangeReason && (
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-xs text-amber-950 dark:text-amber-200">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-amber-900">
                <Clock className="w-4 h-4 text-amber-600" />
                Updated Preparation Estimate
              </span>
              <span className="text-[10px] font-semibold text-amber-800">
                Updated at {activeOrder.etaUpdatedAt || '7:31 PM'}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-amber-300/40 font-mono">
              <span className="line-through text-muted text-xs">Previous: {activeOrder.previousEstimate || '7:38 PM'}</span>
              <span className="font-bold text-amber-800 text-sm">New ETA: {activeOrder.estimatedReadyAt || '7:46 PM'}</span>
            </div>
            <p className="text-xs"><strong>Reason:</strong> {activeOrder.etaChangeReason}</p>
          </section>
        )}

        {/* Active Status Hero Card */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/20 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-3 animate-pulse">
            <Icon name="cooking" className="text-3xl" filled />
          </div>
          <h2 className="text-lg font-bold text-on-surface mb-1">Our kitchen is preparing your order</h2>
          <p className="text-xs text-on-surface-variant mb-3">Preparation estimates reflect live kitchen volume.</p>
          <div className="inline-block bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">Estimated Window</span>
            <span className="text-2xl font-black text-primary">{activeOrder.estimatedReadyAt || '7:46 PM'} ({formattedTimer})</span>
          </div>
        </section>

        {/* Partial-Order Item Readiness Section */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <Icon name="checklist" className="text-primary text-base" />
              Item Readiness Tracking
            </h3>
            <span className="text-xs font-semibold text-on-surface-variant">
              {readyItems.length} of {items.length} Ready
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {items.map((item, idx) => {
              const isReady = item.readinessStatus === 'READY';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    isReady
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                      : 'bg-surface-container-low border-outline-variant/10 text-on-surface'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isReady ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                    )}
                    <div>
                      <span className="font-bold">{item.name} (x{item.quantity})</span>
                      {item.note && <p className="text-[11px] opacity-80 italic">"{item.note}"</p>}
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isReady ? 'bg-emerald-500/20 text-emerald-800' : 'bg-amber-500/20 text-amber-800'}`}>
                    {isReady ? 'Ready' : 'Still Preparing'}
                  </span>
                </div>
              );
            })}
          </div>

          {readyItems.length > 0 && preparingItems.length > 0 && (
            <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Have ready dishes served early?</span>
              <label className="flex items-center gap-2 font-bold text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={serveReadyFirst}
                  onChange={(e) => {
                    setServeReadyFirst(e.target.checked);
                    showToast(e.target.checked ? 'Notified waiter to serve ready items first' : 'Standard serving sequence restored', 'info');
                  }}
                  className="rounded text-primary focus:ring-primary"
                />
                Serve ready items first
              </label>
            </div>
          )}
        </section>

        {/* Progress Timeline */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/20">
          <OrderTimeline currentStageIndex={currentStageIndex} />
        </div>

        {/* Prominent Service Recovery Action: "Something isn't right" */}
        <section className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-700 font-bold">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-rose-950 dark:text-rose-200 text-sm">Something isn’t right?</h4>
                <p className="text-xs text-rose-900/80">Report missing items, cold food, delays, or billing questions.</p>
              </div>
            </div>
          </div>

          {activeIssue ? (
            <div className="p-3 bg-surface rounded-xl border border-rose-400/40 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-800 flex items-center gap-1">
                  <Icon name="pending_actions" className="text-sm" />
                  Issue Ticket #{activeIssue.issueId}
                </span>
                <span className="bg-rose-500/20 text-rose-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  {activeIssue.statusLabel || activeIssue.status}
                </span>
              </div>
              <p className="text-on-surface-variant font-medium">• Owner: <strong>{activeIssue.assignedOwner}</strong></p>
              {activeIssue.recoveryAction && (
                <p className="text-on-surface text-[11px] bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <strong>Action:</strong> {activeIssue.recoveryAction}
                </p>
              )}
              <button
                onClick={() => navigate('/report-status')}
                className="w-full py-1.5 bg-rose-600 text-white rounded-lg font-bold text-xs shadow hover:bg-rose-700"
              >
                View Issue Status & Confirm Resolution
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/report-issue')}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="report_problem" className="text-base" />
              <span>Report an Issue (Service Recovery)</span>
            </button>
          )}
        </section>

        {/* Waiter Assistance Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setIsAssistanceModalOpen(true)}
            className="h-12 rounded-xl border border-outline text-on-surface font-bold text-xs hover:bg-surface-container flex items-center justify-center gap-2 transition-colors"
          >
            <Icon name="support_agent" className="text-primary text-base" />
            <span>Request Waiter Assistance</span>
          </button>
          <button
            onClick={() => handleRequestAssistanceOption('Call Waiter')}
            disabled={!!activeAssistance}
            className="h-12 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            <Icon name="front_hand" className="text-base" />
            <span>{activeAssistance ? 'Rahul Notified (On the way)' : 'Call Waiter to Table'}</span>
          </button>
        </section>
      </main>

      <BottomNavBar />

      {/* Trust Profile Modal */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      {/* Waiter Assistance Modal */}
      <Modal isOpen={isAssistanceModalOpen} onClose={() => setIsAssistanceModalOpen(false)} title="Request Waiter Assistance" position="bottom">
        <div className="space-y-2">
          {activeAssistance && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 font-medium mb-3">
              Rahul Sharma has accepted your request. Expected response in a few minutes.
            </div>
          )}
          {[
            'Order update',
            'Need water pitcher',
            'Need extra cutlery',
            'Check delayed item',
            'Billing assistance',
            'Allergy assistance',
            'Speak to manager',
          ].map((req) => (
            <button
              key={req}
              onClick={() => handleRequestAssistanceOption(req)}
              className="w-full text-left p-3.5 bg-surface-container-low hover:bg-primary/5 rounded-xl text-xs font-bold text-on-surface transition-colors flex items-center justify-between border border-outline-variant/10"
            >
              <span>{req}</span>
              <Icon name="chevron_right" className="text-on-surface-variant" />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default OrderTrackingScreen;
