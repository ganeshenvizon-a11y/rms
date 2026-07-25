import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';

const BillScreen = () => {
  const navigate = useNavigate();
  const { activeOrder } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isNotifyingStaff, setIsNotifyingStaff] = useState(false);

  const handlePayAtCounter = async () => {
    setIsNotifyingStaff(true);
    try {
      await orderService.requestAssistance(tableNumber, 'Cash Settlement at Counter');
      showToast(`Staff notified for cash collection at Table ${tableNumber}.`, 'success');
      setIsCashModalOpen(false);
    } catch (err) {
      showToast('Error notifying staff', 'error');
    } finally {
      setIsNotifyingStaff(false);
    }
  };

  if (!activeOrder) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="receipt_long" className="text-4xl" />}
            title="No active bill found"
            description="Place an order from our menu to generate a table bill."
            actionLabel="Go to Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
    );
  }

  const totals = activeOrder.totals || { subtotal: 0, tax: 0, vat: 0, tipAmount: 0, discountAmount: 0, grandTotal: 0 };

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-20 pb-24 max-w-[1280px] mx-auto w-full px-4 md:px-10">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">Bill Summary</h2>
          <p className="text-sm text-on-surface-variant">Review your selection before proceeding to secure payment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="md:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase mb-1">Order Number</p>
                <p className="text-lg font-bold text-on-surface">#{activeOrder.orderId}</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30">
                <p className="text-xs text-on-surface-variant uppercase mb-1">Table</p>
                <p className="text-lg font-bold text-on-surface">{tableNumber}</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
              <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low">
                <h3 className="text-xs font-bold text-on-surface uppercase">Items Ordered</h3>
              </div>
              {activeOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex items-center justify-between hover:bg-surface-container-high/30 transition-colors ${
                    idx > 0 ? 'border-t border-outline-variant/10' : ''
                  }`}
                >
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-dim flex-shrink-0">
                      {item.image ? (
                        <img className="w-full h-full object-cover" src={item.image} alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant/60">
                          <Icon name="restaurant" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-on-surface truncate">{item.name}</h4>
                      <p className="text-xs text-on-surface-variant">{item.quantity}x</p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-on-surface flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5">
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-outline-variant/30 md:sticky md:top-24">
              <h3 className="text-lg font-bold text-on-surface mb-6">Payment Details</h3>
              <div className="space-y-3 border-b border-outline-variant/30 pb-4 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Service Tax (5%)</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>VAT (8%)</span>
                  <span>{formatCurrency(totals.vat)}</span>
                </div>
                {totals.tipAmount > 0 && (
                  <div className="flex justify-between text-secondary font-medium">
                    <span>Gratitude Tip</span>
                    <span>+{formatCurrency(totals.tipAmount)}</span>
                  </div>
                )}
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-error font-medium">
                    <span>Promo Discount</span>
                    <span>-{formatCurrency(totals.discountAmount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-end mt-6 mb-8">
                <div>
                  <p className="text-xs text-on-surface-variant uppercase">Grand Total</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(totals.grandTotal)}</p>
                </div>
                <Icon name="receipt_long" className="text-outline-variant text-4xl" />
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/payment')}
                  className="w-full h-14 bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md"
                >
                  <Icon name="payments" />
                  Proceed to Payment
                </button>
                <button
                  onClick={() => setIsCashModalOpen(true)}
                  className="w-full h-14 bg-transparent border-2 border-primary text-primary rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 active:scale-95 transition-all"
                >
                  <Icon name="storefront" />
                  Pay at Counter
                </button>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex items-center gap-3 text-on-surface-variant/60">
                <Icon name="verified_user" />
                <p className="text-xs">Secure encrypted payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavBar />

      <Modal isOpen={isCashModalOpen} onClose={() => setIsCashModalOpen(false)} title="Pay At Counter / Cash Settlement">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center mx-auto">
            <Icon name="storefront" className="text-3xl" />
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Would you like to notify staff to come to Table {tableNumber} for cash/counter settlement of{' '}
            <span className="font-bold text-on-surface">{formatCurrency(totals.grandTotal)}</span>?
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={handlePayAtCounter}
              disabled={isNotifyingStaff}
              className="w-full h-12 bg-primary text-on-primary rounded-xl font-semibold disabled:opacity-60"
            >
              {isNotifyingStaff ? 'Notifying...' : 'Notify Staff for Cash Payment'}
            </button>
            <button
              onClick={() => setIsCashModalOpen(false)}
              className="w-full h-12 border border-outline-variant text-on-surface rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BillScreen;
