import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { formatCurrency } from '../../utils/formatters';
import Icon from '../../components/common/Icon';

const CONFETTI_DOTS = [
  { className: 'bg-red-400 top-4 left-1/4' },
  { className: 'bg-yellow-400 top-10 right-1/3' },
  { className: 'bg-green-400 bottom-4 left-1/3' },
  { className: 'bg-blue-400 bottom-10 right-1/4' },
  { className: 'bg-orange-400 top-1/2 left-10' },
];

const OrderConfirmationScreen = () => {
  const navigate = useNavigate();
  const { activeOrder } = useOrder();
  const { tableNumber } = useTable();

  const orderTime = activeOrder?.createdAt
    ? new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const totals = activeOrder?.totals || { subtotal: 0, tax: 0, vat: 0, grandTotal: 0 };
  const taxesAndCharges = (totals.tax || 0) + (totals.vat || 0);

  return (
    <main className="flex-1 flex flex-col bg-background">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4">
        {/* Header */}
        <header className="flex justify-between items-center py-6">
          <button aria-label="Back" onClick={() => navigate('/menu')} className="p-2 -ml-2 text-on-surface">
            <Icon name="arrow_back" />
          </button>
          <button className="text-sm font-semibold text-on-surface">Support</button>
        </header>

        {/* Success Status */}
        <section className="text-center mb-6">
          <div className="relative h-[120px] w-full flex justify-center items-center">
            <div className="z-10 bg-green-500 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg">
              <Icon name="check" className="text-4xl" filled />
            </div>
            {CONFETTI_DOTS.map((dot, idx) => (
              <div key={idx} className={`absolute w-1.5 h-1.5 rounded-full ${dot.className}`} />
            ))}
          </div>
          <h1 className="text-2xl font-bold mt-2 text-on-surface">Order placed successfully!</h1>
          <p className="text-on-surface-variant mt-1 flex items-center justify-center gap-1 text-sm">
            Thanks! Your order is being prepared <span className="text-red-500">&#10084;</span>
          </p>
        </section>

        {/* Order Quick Details */}
        <section className="bg-secondary-container/10 rounded-xl p-4 flex justify-between items-center mb-4 border border-secondary-container/20">
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Order ID</p>
            <p className="text-primary font-bold text-lg">#{activeOrder?.orderId || 'PENDING'}</p>
          </div>
          <div className="w-px h-8 bg-outline-variant/50" />
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Table</p>
            <p className="font-bold text-lg text-on-surface">{tableNumber}</p>
          </div>
          <div className="w-px h-8 bg-outline-variant/50" />
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Order Time</p>
            <p className="font-bold text-lg text-on-surface">{orderTime}</p>
          </div>
        </section>

        {/* Preparation Card */}
        <section className="bg-secondary-container/10 rounded-xl p-4 flex items-center justify-between mb-6 border border-secondary-container/20">
          <div className="flex items-center gap-3">
            <div className="bg-secondary-container/30 p-2 rounded-lg">
              <Icon name="hourglass_top" className="text-secondary" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Estimated preparation time</p>
              <p className="font-bold text-lg text-on-surface">15-20 mins</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/order-tracking')}
            className="bg-surface-container-lowest border border-outline-variant/50 py-2 px-4 rounded-xl text-sm font-semibold text-primary flex items-center gap-1"
          >
            Track order
            <Icon name="chevron_right" className="text-lg" />
          </button>
        </section>

        {/* Order Summary */}
        <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex-grow mb-6">
          <h2 className="font-bold text-lg mb-4 text-on-surface">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {(activeOrder?.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                  {item.image ? (
                    <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/60">
                      <Icon name="restaurant" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-on-surface truncate">{item.name}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-on-surface">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-outline-variant/50 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-on-surface-variant font-medium">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant font-medium">
              <span>Taxes &amp; Charges</span>
              <span>{formatCurrency(taxesAndCharges)}</span>
            </div>
          </div>
          <div className="border-t border-outline-variant/30 mt-4 pt-4 flex justify-between items-center">
            <span className="font-bold text-lg text-on-surface">Total Amount</span>
            <span className="font-bold text-2xl text-primary">{formatCurrency(totals.grandTotal)}</span>
          </div>
        </section>

        {/* Secondary Actions */}
        <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/10 flex justify-between items-center">
          <div className="flex gap-3">
            <Icon name="receipt_long" className="text-primary" />
            <p className="text-xs text-on-surface-variant leading-tight">
              You can view your order details
              <br />
              in the Orders section
            </p>
          </div>
          <button
            onClick={() => navigate('/order-tracking')}
            className="text-xs font-bold text-primary flex items-center gap-1 flex-shrink-0"
          >
            Go to orders
            <Icon name="chevron_right" className="text-sm" />
          </button>
        </div>

        {/* Footer Actions */}
        <footer className="mt-auto space-y-3 pb-8">
          <button
            onClick={() => navigate('/order-tracking')}
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            Track order
            <Icon name="chevron_right" />
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-surface-container-lowest border-2 border-primary text-on-surface font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Icon name="add" className="text-primary" />
            Order more
          </button>
        </footer>
      </div>
    </main>
  );
};

export default OrderConfirmationScreen;
