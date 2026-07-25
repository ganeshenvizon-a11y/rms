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

const OrderTrackingScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, updateOrderStatus } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [currentStageIndex, setCurrentStageIndex] = useState(activeOrder?.stageIndex || 0);
  const [remainingSeconds, setRemainingSeconds] = useState(14 * 60);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [isCallingWaiter, setIsCallingWaiter] = useState(false);

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

  const handleRequestWaiter = async () => {
    setIsCallingWaiter(true);
    try {
      await orderService.requestAssistance(tableNumber, 'Call Waiter');
      showToast(`Staff notified! Waiter heading to Table ${tableNumber}.`, 'success');
    } catch (err) {
      showToast('Request failed. Please try again.', 'error');
    } finally {
      setIsCallingWaiter(false);
    }
  };

  const handleCustomAssistance = async (type) => {
    try {
      await orderService.requestAssistance(tableNumber, type);
      showToast(`Requested "${type}" for Table ${tableNumber}`, 'success');
      setIsAssistanceModalOpen(false);
    } catch (err) {
      showToast('Failed to notify staff', 'error');
    }
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

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-20 pb-28 max-w-2xl mx-auto w-full px-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-on-surface-variant">
            Order #{activeOrder.orderId} &bull; Table {tableNumber}
          </p>
          <button
            onClick={handleNextStage}
            className="px-3 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full text-[10px] font-bold"
          >
            Advance Demo Stage &#8594;
          </button>
        </div>

        {/* Active Status Hero Card */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.06)]">
          <div className="relative z-10 p-6 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-4 animate-pulse-ring">
              <Icon name="cooking" className="text-3xl" filled />
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">Our chefs are preparing your meal.</h2>
            <div className="flex flex-col items-center">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Estimated Arrival</p>
              <span className="text-4xl font-bold text-primary">{formattedTimer}</span>
            </div>
          </div>
        </section>

        {/* Progress Timeline */}
        <div className="mt-8 bg-surface-container-lowest rounded-xl p-6 shadow-sm">
          <OrderTimeline currentStageIndex={currentStageIndex} />
        </div>

        {/* Action Buttons */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setIsAssistanceModalOpen(true)}
            className="h-14 rounded-xl border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors active:scale-95"
          >
            Need Assistance
          </button>
          <button
            onClick={handleRequestWaiter}
            disabled={isCallingWaiter}
            className="h-14 rounded-xl bg-primary text-on-primary font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
          >
            <Icon name="front_hand" />
            {isCallingWaiter ? 'Notifying...' : 'Request Waiter'}
          </button>
        </section>

        {/* Suggestion */}
        <div className="mt-6 p-5 bg-secondary-container/10 rounded-xl flex items-center gap-4 border border-secondary-container/20">
          <Icon name="lightbulb" className="text-secondary" filled />
          <p className="text-sm text-on-surface">
            Did you know? Our filter coffee is brewed with beans sourced directly from Kumbakonam estates.
          </p>
        </div>
      </main>

      <BottomNavBar />

      <Modal isOpen={isAssistanceModalOpen} onClose={() => setIsAssistanceModalOpen(false)} title="Table Assistance Requests" position="bottom">
        <div className="space-y-3">
          {[
            'Request Water Pitcher / Ice',
            'Request Extra Cutlery & Napkins',
            'Request Extra Chutney / Sambar',
            'Request Bill at Table',
            'Clean Table Surface',
          ].map((req) => (
            <button
              key={req}
              onClick={() => handleCustomAssistance(req)}
              className="w-full text-left p-4 bg-surface-container-low hover:bg-primary/5 rounded-xl text-sm font-semibold text-on-surface transition-colors flex items-center justify-between"
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
