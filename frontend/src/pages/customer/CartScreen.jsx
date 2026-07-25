import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { formatCurrency } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';

const CartScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const {
    cartItems,
    updateQuantity,
    clearCart,
    tipPercentage,
    setTipPercentage,
    appliedPromo,
    setAppliedPromo,
    specialOrderNotes,
    setSpecialOrderNotes,
    totals,
  } = useCart();
  const { placeOrder } = useOrder();
  const { showToast } = useToast();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setIsApplyingPromo(true);
    try {
      const res = await cartService.applyPromoCode(promoCodeInput);
      if (res.data.success) {
        setAppliedPromo(res.data.promo);
        showToast(`Promo "${res.data.promo.code}" applied successfully!`, 'success');
        setPromoCodeInput('');
      } else {
        showToast(res.data.message || 'Invalid promo code', 'error');
      }
    } catch (err) {
      showToast('Error applying promo code', 'error');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setIsPlacingOrder(true);
    try {
      const payload = { tableNumber, items: cartItems, totals, specialNotes: specialOrderNotes };
      const res = await orderService.createOrder(payload);
      placeOrder(res.data);
      clearCart();
      showToast('Order placed successfully with the kitchen!', 'success');
      navigate('/order-confirmation');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <TopAppBar variant="brand" />
        <main className="flex-1 pt-20 px-4">
          <EmptyState
            icon={() => <Icon name="shopping_bag" className="text-4xl" />}
            title="Your cart is empty"
            description="Explore our authentic South Indian menu and add items to your cart to begin your dining experience."
            actionLabel="Browse Full Menu"
            onAction={() => navigate('/menu')}
          />
        </main>
        <BottomNavBar />
      </>
    );
  }

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-20 pb-56 md:pb-16 max-w-[1280px] mx-auto w-full px-4 md:px-10">
        <header className="mb-6">
          <h2 className="text-2xl md:text-4xl font-bold text-on-surface">Your Selection</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Table {tableNumber} &bull; Ready for an authentic culinary journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Items */}
          <div className="md:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => {
              const itemCustomizationTotal =
                item.selectedCustomizations?.reduce((acc, opt) => acc + (opt.price || 0), 0) || 0;
              const singleUnitPrice = item.price + itemCustomizationTotal;
              const itemTotalPrice = singleUnitPrice * item.quantity;

              return (
                <div
                  key={item.cartItemId || item.id}
                  className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 items-center shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-surface-container-low"
                  />
                  <div className="flex-grow flex flex-col justify-between min-w-0 self-stretch">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-on-surface text-lg truncate">{item.name}</h3>
                        {item.selectedCustomizations?.length > 0 ? (
                          <p className="text-xs text-on-surface-variant truncate">
                            {item.selectedCustomizations.map((c) => c.name).join(', ')}
                          </p>
                        ) : (
                          item.itemNote && (
                            <p className="text-xs text-on-surface-variant italic truncate">"{item.itemNote}"</p>
                          )
                        )}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.cartItemId || item.id, 0)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-error-container flex-shrink-0"
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-2">
                      <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 gap-4">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high active:scale-90 transition-all"
                        >
                          <Icon name="remove" className="text-secondary text-lg" />
                        </button>
                        <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high active:scale-90 transition-all"
                        >
                          <Icon name="add" className="text-secondary text-lg" />
                        </button>
                      </div>
                      <span className="font-semibold text-primary">{formatCurrency(itemTotalPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Special Instructions */}
            <div>
              <label className="text-sm font-semibold text-on-surface mb-2 block">Special Instructions</label>
              <textarea
                rows={3}
                value={specialOrderNotes}
                onChange={(e) => setSpecialOrderNotes(e.target.value)}
                placeholder="e.g. Extra spicy sambar, no coconut chutney, etc."
                className="w-full bg-surface-container-lowest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary text-sm placeholder:text-outline shadow-sm resize-none outline-none"
              />
            </div>

            {/* Promo Code */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="sell" className="text-secondary" />
                  <span className="text-sm font-bold text-on-surface">Promo Code or Voucher</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/60 font-medium">Try: DAKSHIN10</span>
              </div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-secondary-container/20 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-on-surface">{appliedPromo.code}</span>
                    <p className="text-[10px] text-on-surface-variant">{appliedPromo.description}</p>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="text-[11px] font-bold text-error underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 py-2 bg-surface-container-low rounded-xl text-xs uppercase font-bold outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !promoCodeInput.trim()}
                    className="px-4 py-2 bg-on-surface text-surface rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Tip Selector */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm space-y-3">
              <span className="text-sm font-bold text-on-surface">Staff Gratitude Tip</span>
              <div className="grid grid-cols-4 gap-2">
                {[0, 5, 10, 15].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setTipPercentage(tip)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      tipPercentage === tip
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    {tip === 0 ? 'No Tip' : `${tip}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex gap-4 mt-2">
              <button
                onClick={() => navigate('/menu')}
                className="flex-grow h-14 border border-on-surface text-on-surface rounded-xl font-semibold hover:bg-surface-container transition-colors active:scale-95"
              >
                Continue Ordering
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-[2] h-14 bg-primary-container text-on-primary rounded-xl font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md disabled:opacity-60"
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order • ${formatCurrency(totals.grandTotal)}`}
              </button>
            </div>
          </div>

          {/* Right: Desktop Summary */}
          <div className="hidden md:block md:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] sticky top-24">
              <h3 className="text-lg font-bold text-on-surface mb-6">Order Summary</h3>
              <div className="flex flex-col gap-3 border-b border-outline-variant/40 pb-6 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Service Tax (5%)</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">VAT (8%)</span>
                  <span>{formatCurrency(totals.vat)}</span>
                </div>
                {totals.tipAmount > 0 && (
                  <div className="flex justify-between text-secondary font-medium">
                    <span>Staff Tip ({tipPercentage}%)</span>
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
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Grand Total</span>
                <span className="text-primary">{formatCurrency(totals.grandTotal)}</span>
              </div>
              <p className="text-xs text-on-surface-variant text-center">Prices include GST where applicable.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Summary */}
      <div className="md:hidden fixed bottom-20 left-0 w-full bg-surface p-4 flex flex-col gap-2 z-40 rounded-t-xl shadow-[0px_-10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant">Total Payment</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(totals.grandTotal)}</span>
          </div>
          <button
            onClick={() => setShowMobileDetails((s) => !s)}
            className="text-primary text-sm font-semibold flex items-center gap-0.5"
          >
            Details
            <Icon name={showMobileDetails ? 'expand_more' : 'expand_less'} />
          </button>
        </div>
        {showMobileDetails && (
          <div className="flex flex-col gap-1 pb-2 border-b border-outline-variant/40 text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Taxes</span>
              <span>{formatCurrency(totals.tax + totals.vat)}</span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 h-12 border border-on-surface text-on-surface rounded-xl font-semibold active:scale-95 transition-transform text-sm"
          >
            Continue
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="flex-[2] h-12 bg-primary-container text-on-primary rounded-xl font-semibold active:scale-95 transition-transform shadow-md text-sm disabled:opacity-60"
          >
            {isPlacingOrder ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>

      <BottomNavBar />
    </>
  );
};

export default CartScreen;
