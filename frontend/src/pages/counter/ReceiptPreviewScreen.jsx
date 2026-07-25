import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import CounterShell from '../../components/layout/CounterShell';
import {
  UtensilsCrossed,
  Printer,
  Download,
  Mail,
  Send,
  ArrowLeft,
  Lightbulb,
  QrCode
} from 'lucide-react';

const ReceiptPreviewScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receipts } = useOrder();

  const receipt = location.state?.receipt || receipts[0];

  const paperRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [phone, setPhone] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 2200);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = (y - rect.height / 2) / 20;
    const rotateY = (rect.width / 2 - x) / 20;
    setTilt({ x: rotateX, y: rotateY });
  };

  if (!receipt) {
    return (
      <CounterShell showSearch={false}>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
          <p>No receipt to display yet.</p>
          <button
            onClick={() => navigate('/counter/pending-bills')}
            className="text-primary font-semibold hover:underline"
          >
            Go process a payment
          </button>
        </div>
      </CounterShell>
    );
  }

  return (
    <CounterShell showSearch={false}>
      <main className="p-8 flex flex-col md:flex-row gap-12 items-start justify-center">
        {/* Receipt Paper */}
        <div className="w-full md:w-auto flex justify-center" style={{ perspective: '1000px' }}>
          <div
            ref={paperRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
              fontFamily: "'Courier New', Courier, monospace",
            }}
            className="w-[380px] p-8 bg-white text-on-surface shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-2">
                <UtensilsCrossed className="w-9 h-9 text-primary" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest">{RESTAURANT_INFO.name}</h2>
              <p className="text-xs">{RESTAURANT_INFO.location}</p>
            </div>

            <div className="border-t border-dashed border-on-surface-variant py-4 mb-4 text-sm space-y-1">
              <div className="flex justify-between"><span>Order:</span><span className="font-bold">#{receipt.orderId}</span></div>
              <div className="flex justify-between"><span>Table:</span><span>{receipt.tableNumber}</span></div>
              <div className="flex justify-between"><span>Date:</span><span>{new Date(receipt.timestamp).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Server:</span><span>{receipt.serverName}</span></div>
              <div className="flex justify-between"><span>Cashier:</span><span>{receipt.cashierName}</span></div>
            </div>

            <div className="border-t border-dashed border-on-surface-variant pt-4 space-y-4">
              <div className="flex flex-col gap-2">
                {receipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex gap-3">
                      <span className="w-5">{it.quantity}x</span>
                      <span>{it.name}</span>
                    </div>
                    <span>₹{(it.total || it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-on-surface-variant pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{receipt.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>₹{receipt.tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>VAT</span><span>₹{receipt.vat.toFixed(2)}</span></div>
                {receipt.tip > 0 && (
                  <div className="flex justify-between"><span>Tip</span><span>₹{receipt.tip.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between text-xl font-bold pt-3 border-t border-on-surface mt-2">
                  <span>TOTAL</span><span>₹{receipt.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center text-xs space-y-3">
              <div className="flex justify-center text-on-surface-variant">
                <QrCode className="w-16 h-16" />
              </div>
              <p>Thank you! See you again soon.</p>
              <p className="italic">www.dakshinheritage.example</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full max-w-md space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/20">
            <header className="mb-6">
              <h3 className="text-xl font-bold text-on-surface mb-1">Payment Successful</h3>
              <p className="text-on-surface-variant">
                The transaction of <strong>₹{receipt.grandTotal.toFixed(2)}</strong> was processed successfully. How
                would the customer like their receipt?
              </p>
            </header>

            <div className="space-y-4">
              <button
                onClick={() => window.print()}
                className="w-full h-14 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <Printer className="w-5 h-5" />
                <span className="text-base">Print Receipt</span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => showToast('Receipt PDF downloaded.')}
                  className="h-14 bg-background text-on-surface border border-outline rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => showToast('Receipt emailed to guest.')}
                  className="h-14 bg-background text-on-surface border border-outline rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
              </div>
              <div className="pt-2">
                <label className="block text-xs text-on-surface-variant mb-1 ml-1">Send to Phone (SMS)</label>
                <div className="relative flex">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 000 000 0000"
                    className="w-full h-12 px-4 pr-12 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-0 text-on-surface outline-none"
                  />
                  <button
                    onClick={() => phone && showToast(`Receipt sent via SMS to ${phone}`)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-primary hover:bg-primary-fixed rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-outline-variant/30 flex justify-center">
              <button
                onClick={() => navigate('/counter')}
                className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-2xl border border-secondary-container">
            <Lightbulb className="w-5 h-5 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm">Loyalty Rewards</h4>
              <p className="text-xs">
                This guest is eligible for {Math.round(receipt.grandTotal * 0.2)} bonus points! Mention the rewards
                program to them.
              </p>
            </div>
          </div>
        </div>
      </main>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          {toast}
        </div>
      )}
    </CounterShell>
  );
};

export default ReceiptPreviewScreen;
