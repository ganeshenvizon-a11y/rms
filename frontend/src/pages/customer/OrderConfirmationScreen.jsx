import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { formatInvoiceAmount, formatMenuPrice, formatTime } from '../../utils/formatters';
import Icon from '../../components/common/Icon';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import { AlertTriangle, CheckCircle, Clock, Heart } from 'lucide-react';

const CONFETTI_DOTS = [
  { className: 'bg-red-400 top-4 left-1/4' },
  { className: 'bg-amber-400 top-10 right-1/3' },
  { className: 'bg-emerald-400 bottom-4 left-1/3' },
  { className: 'bg-blue-400 bottom-10 right-1/4' },
  { className: 'bg-orange-400 top-1/2 left-10' },
];

const OrderConfirmationScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, kitchenLoad, customerMemory, saveCustomerMemory, forgetCustomerMemory } = useOrder();
  const { tableNumber } = useTable();
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  const orderTime = formatTime(activeOrder?.createdAt || new Date());
  const totals = activeOrder?.totals || { subtotal: 0, gst: 0, totalPayable: 0 };
  const prepRange = `${kitchenLoad?.averagePreparationMinutes || 20}–${(kitchenLoad?.averagePreparationMinutes || 20) + 5} mins`;

  return (
    <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col px-4 py-4">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <button aria-label="Back" onClick={() => navigate('/menu')} className="p-2 -ml-2 text-gray-700">
            <Icon name="arrow_back" />
          </button>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Table #{tableNumber}
          </span>
        </header>

        {/* Success Status */}
        <section className="text-center mb-4">
          <div className="relative h-[100px] w-full flex justify-center items-center">
            <div className="z-10 bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg">
              <CheckCircle className="w-10 h-10" />
            </div>
            {CONFETTI_DOTS.map((dot, idx) => (
              <div key={idx} className={`absolute w-1.5 h-1.5 rounded-full ${dot.className}`} />
            ))}
          </div>
          <h1 className="text-2xl font-bold mt-2 text-gray-900">Order sent to kitchen!</h1>
          <p className="text-gray-600 mt-1 text-xs">
            Thanks! Your customized order is being prepared with care ❤️
          </p>
        </section>

        {/* Review Customizations Warning Banner */}
        <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-3.5 mb-4 text-amber-900 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Review customizations before confirming your order.</strong> All selected modifiers have been dispatched to kitchen displays.
          </span>
        </div>

        {/* Order Quick Details */}
        <section className="bg-white rounded-2xl p-4 flex justify-between items-center mb-4 border border-gray-200 shadow-sm">
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Order ID</p>
            <p className="text-amber-700 font-bold text-base">#{activeOrder?.orderId || 'ORD-1048'}</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Table</p>
            <p className="font-bold text-base text-gray-900">{tableNumber}</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Order Time</p>
            <p className="font-bold text-base text-gray-900">{orderTime}</p>
          </div>
        </section>

        {/* Honest Preparation Card */}
        <section className="bg-white rounded-2xl p-4 flex items-center justify-between mb-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2.5 rounded-xl text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Estimated preparation window</p>
              <p className="font-bold text-base text-gray-900">{prepRange}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/order-tracking')}
            className="bg-amber-50 border border-amber-200 py-2 px-3 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1 hover:bg-amber-100"
          >
            Track order
            <Icon name="chevron_right" className="text-base" />
          </button>
        </section>

        {/* Order Summary with Modifiers */}
        <section className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-200">
          <h2 className="font-bold text-base mb-4 text-gray-900">Order & Modifier Summary</h2>
          <div className="space-y-4 mb-6">
            {(activeOrder?.items || []).map((item, idx) => {
              const itemTotalPrice = (item.unitPrice !== undefined ? item.unitPrice : item.price) * item.quantity;
              const hasModifiers = (item.selectedCustomizations && item.selectedCustomizations.length > 0) || item.makeVegan || item.jainPreparation;

              return (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image ? (
                        <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Icon name="restaurant" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="font-bold text-amber-700 text-sm font-mono">{formatInvoiceAmount(itemTotalPrice)}</p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  {/* Selected Modifiers Display */}
                  {hasModifiers && (
                    <div className="ml-17 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-xs space-y-1 text-gray-800">
                      {item.makeVegan && <div className="font-semibold text-emerald-800">🌱 Vegan Preparation</div>}
                      {item.jainPreparation && <div className="font-semibold text-emerald-800">🌿 Jain Preparation</div>}
                      {item.selectedCustomizations?.map((mod, mIdx) => (
                        <div key={mIdx} className="flex justify-between">
                          <span>• {mod.label || mod.name}</span>
                          {mod.priceDelta > 0 && <span className="font-mono text-amber-800">+{formatMenuPrice(mod.priceDelta)}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* High Visibility Allergy Alert */}
                  {item.allergyAlert && (
                    <div className="ml-17 bg-red-100 border-l-4 border-red-600 p-2.5 rounded-r-xl text-xs text-red-900 font-bold space-y-0.5">
                      <div className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span>ALLERGY ALERT</span>
                      </div>
                      <p className="text-red-900">{item.allergyAlert}</p>
                    </div>
                  )}

                  {/* Special instructions */}
                  {item.itemNote && (
                    <div className="ml-17 text-xs text-gray-600 italic">
                      Special instruction: "{item.itemNote}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>{formatInvoiceAmount(totals.subtotal || 0)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between font-medium text-emerald-600">
                <span>Discount</span>
                <span>-{formatInvoiceAmount(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>GST @ 5%</span>
              <span>{formatInvoiceAmount(totals.gst ?? totals.tax ?? 0)}</span>
            </div>
            {totals.tipAmount > 0 && (
              <div className="flex justify-between font-medium text-amber-800">
                <span>Optional Staff Tip</span>
                <span>+{formatInvoiceAmount(totals.tipAmount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center">
            <span className="font-bold text-base text-gray-900">Total Payable</span>
            <span className="font-bold text-xl text-amber-700">{formatInvoiceAmount(totals.totalPayable || totals.grandTotal || 0)}</span>
          </div>
        </section>

        {/* Footer Actions */}
        <footer className="mt-auto space-y-3 pb-6">
          <button
            onClick={() => navigate('/order-tracking')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
          >
            <span>Track Order Status</span>
            <Icon name="chevron_right" />
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            <Icon name="add" className="text-amber-600" />
            <span>Order More Dishes</span>
          </button>
        </footer>
      </div>

      <CustomerPreferencesModal
        isOpen={false}
        onClose={() => setIsPrefsOpen(false)}
        customerMemory={customerMemory}
        onSaveMemory={saveCustomerMemory}
        onForgetMemory={forgetCustomerMemory}
      />
    </main>
  );
};

export default OrderConfirmationScreen;
