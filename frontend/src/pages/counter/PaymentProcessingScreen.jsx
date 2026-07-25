import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { DISHES } from '../../utils/mockData';
import CounterShell from '../../components/layout/CounterShell';
import {
  Banknote,
  CreditCard,
  Wallet,
  QrCode,
  SplitSquareHorizontal,
  Ticket,
  CheckCircle2,
  Delete,
  Sparkles
} from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: Banknote },
  { id: 'card', label: 'Credit Card', icon: CreditCard },
  { id: 'debit', label: 'Debit Card', icon: Wallet },
  { id: 'upi', label: 'UPI', icon: QrCode },
  { id: 'split', label: 'Split Payment', icon: SplitSquareHorizontal },
  { id: 'voucher', label: 'Voucher', icon: Ticket },
];

const METHOD_LABELS = {
  cash: 'Cash',
  card: 'Credit Card',
  debit: 'Debit Card',
  upi: 'UPI',
  split: 'Split Payment',
  voucher: 'Voucher',
};

const DEFAULT_BILL = {
  id: 'demo-bill',
  orderId: 'ORD-8045',
  tableNumber: '08',
  serverName: 'Elena Vance',
  guestCount: 2,
  subtotal: 73.50,
  tax: 3.68,
  vat: 3.68,
  grandTotal: 80.85,
};

const PaymentProcessingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { kitchenOrders, processCounterPayment, toggleRegisterDrawer, registerSession } = useOrder();

  const bill = location.state?.bill || DEFAULT_BILL;

  const items = useMemo(() => {
    const matchedKitchen = kitchenOrders.find((k) => k.tableNumber === bill.tableNumber);
    if (matchedKitchen?.items?.length) {
      return matchedKitchen.items.map((it) => {
        const dish = DISHES.find((d) => d.id === it.dishId) || {};
        return { name: it.name, quantity: it.quantity, price: dish.price || bill.subtotal / (it.quantity || 1) };
      });
    }
    return [{ name: 'Table Service Charges', quantity: 1, price: bill.subtotal }];
  }, [kitchenOrders, bill]);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState(bill.grandTotal.toFixed(2));
  const [loyaltyAdded, setLoyaltyAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = useMemo(() => {
    const rounded10 = Math.ceil(bill.grandTotal / 10) * 10;
    return [Math.ceil(bill.grandTotal), rounded10, rounded10 + 10];
  }, [bill.grandTotal]);

  const handleNumpad = (val) => {
    setAmount((prev) => {
      if (val === 'backspace') return prev.slice(0, -1) || '0';
      if (val === '.' && prev.includes('.')) return prev;
      if (prev === bill.grandTotal.toFixed(2)) return val === '.' ? '0.' : val;
      return prev + val;
    });
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    const methodLabel = METHOD_LABELS[paymentMethod];
    if (paymentMethod === 'cash') toggleRegisterDrawer(true);

    const receipt = processCounterPayment({
      orderId: bill.orderId || `ORD-${bill.tableNumber}`,
      tableNumber: bill.tableNumber,
      serverName: bill.serverName,
      cashierName: registerSession.cashierName,
      paymentMethod: methodLabel,
      cardBrand: paymentMethod === 'card' || paymentMethod === 'debit' ? 'Visa ending in 8842' : undefined,
      referenceNo: paymentMethod === 'upi' ? `UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}` : undefined,
      tenderedAmount: parseFloat(amount) || bill.grandTotal,
      changeGiven: Math.max(0, (parseFloat(amount) || 0) - bill.grandTotal),
      subtotal: bill.subtotal,
      tax: bill.tax,
      vat: bill.vat,
      discount: 0,
      grandTotal: bill.grandTotal,
      items,
      billId: bill.id,
    });

    setTimeout(() => {
      navigate('/counter/receipt', { state: { receipt } });
    }, 400);
  };

  return (
    <CounterShell showSearch={false}>
      <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Order Summary</h2>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Table {bill.tableNumber}
              </span>
            </div>
            <div className="flex flex-col gap-4 mb-8">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-on-surface">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <span className="text-base text-on-surface">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-outline-variant/40 flex flex-col gap-2">
              <div className="flex justify-between text-sm font-semibold text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-on-surface-variant">
                <span>Taxes</span>
                <span>₹{(bill.tax + bill.vat).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end mt-2 pt-2 border-t border-outline-variant/30">
                <span className="text-xl font-bold text-on-surface">Grand Total</span>
                <span className="text-4xl font-bold text-primary">₹{bill.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high/40 p-5 rounded-2xl border border-dashed border-outline flex items-center gap-4">
            <Sparkles className="w-7 h-7 text-secondary shrink-0" />
            <div>
              <p className="text-sm font-bold text-on-surface">Add Loyalty Member</p>
              <p className="text-xs text-on-surface-variant">Earn {Math.round(bill.grandTotal)} points on this order</p>
            </div>
            <button
              onClick={() => setLoyaltyAdded(true)}
              className="ml-auto text-primary font-bold text-sm shrink-0"
            >
              {loyaltyAdded ? 'Added ✓' : 'Add'}
            </button>
          </div>
        </div>

        {/* Right: Payment Workflow */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-on-surface mb-6">Select Payment Method</h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
                const isActive = paymentMethod === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border relative transition-all ${
                      isActive ? 'border-2 border-primary bg-background' : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <span className={`text-sm ${isActive ? 'font-bold text-on-surface' : 'text-on-surface'}`}>{label}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-primary absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                    Amount to Pay
                  </label>
                  <div className="bg-surface-container-low p-6 rounded-xl flex justify-between items-center border-2 border-transparent focus-within:border-primary transition-all">
                    <span className="text-4xl text-on-surface">₹</span>
                    <span className="text-4xl text-on-surface">{amount}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-on-surface">Quick Amounts</p>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toFixed(2))}
                        className="px-5 py-2.5 rounded-full bg-surface-variant text-sm font-semibold text-on-surface hover:brightness-95 transition-all"
                      >
                        ${amt.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleNumpad(key)}
                    className="h-16 bg-surface-container-high rounded-xl text-xl font-semibold flex items-center justify-center hover:brightness-95 active:scale-95 transition-transform"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => handleNumpad('backspace')}
                  className="h-16 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-8">
              <button
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="flex-grow bg-primary text-on-primary h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0px_10px_30px_rgba(147,0,11,0.2)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5" />
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </button>
              <button
                onClick={() => navigate('/counter/pending-bills')}
                className="px-8 border-2 border-on-surface-variant text-on-surface-variant h-14 rounded-2xl font-bold text-lg hover:bg-surface-variant active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </CounterShell>
  );
};

export default PaymentProcessingScreen;
