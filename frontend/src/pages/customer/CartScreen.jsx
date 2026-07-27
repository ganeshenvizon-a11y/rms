import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { formatInvoiceAmount, formatMenuPrice } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import BillingSummary from '../../components/common/BillingSummary';
import CustomizationModal from '../../components/menu/CustomizationModal';
import HonestExpectationBanner from '../../components/order/HonestExpectationBanner';
import { AlertTriangle, Edit3, Trash2, Plus, Minus, Info } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    updateCartItemCustomization,
    clearCart,
    tipPercentage,
    setTipPercentage,
    customTipAmount,
    setCustomTipAmount,
    selectedTipOption,
    setSelectedTipOption,
    appliedPromo,
    setAppliedPromo,
    specialOrderNotes,
    setSpecialOrderNotes,
    totals,
  } = useCart();
  const { placeOrder, kitchenLoad } = useOrder();
  const { showToast } = useToast();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  // Editing state for customization modal
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (newPayload) => {
    if (!editingItem) return;
    updateCartItemCustomization(editingItem.cartItemId, newPayload);
    showToast(`Updated customization for ${editingItem.name}`, 'success');
    setIsEditModalOpen(false);
    setEditingItem(null);
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
        <header className="mb-4">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">Your Selection</h2>
          <p className="text-sm text-gray-600 mt-1">
            Table {tableNumber} &bull; Ready for an authentic culinary journey.
          </p>
        </header>

        {/* Honest Expectation Banner before checkout */}
        <section className="mb-6">
          <HonestExpectationBanner
            kitchenLoad={kitchenLoad}
            estimatedRange={`${kitchenLoad?.averagePreparationMinutes || 20}–${(kitchenLoad?.averagePreparationMinutes || 20) + 5} mins`}
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Items */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {cartItems.map((item) => {
              const singleUnitPrice = item.unitPrice !== undefined ? item.unitPrice : item.price;
              const itemTotalPrice = singleUnitPrice * item.quantity;
              const hasModifiers = (item.selectedCustomizations && item.selectedCustomizations.length > 0) || item.makeVegan || item.jainPreparation;

              return (
                <div
                  key={item.cartItemId || item.id}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                          <span className="text-xs text-amber-700 font-semibold font-mono">
                            {formatMenuPrice(singleUnitPrice)} each
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId || item.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Display Selected Modifiers List */}
                      {hasModifiers && (
                        <div className="mt-2 text-xs space-y-1 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                          {item.makeVegan && (
                            <div className="text-emerald-800 font-semibold flex items-center gap-1">
                              <span>🌱 Vegan Preparation</span>
                            </div>
                          )}
                          {item.jainPreparation && (
                            <div className="text-emerald-800 font-semibold flex items-center gap-1">
                              <span>🌿 Jain Preparation</span>
                            </div>
                          )}
                          {item.selectedCustomizations?.map((mod, idx) => (
                            <div key={idx} className="text-gray-700 font-medium flex justify-between">
                              <span>• {mod.label || mod.name}</span>
                              {mod.priceDelta && mod.priceDelta > 0 ? (
                                <span className="font-mono text-amber-800">+{formatMenuPrice(mod.priceDelta)}</span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Allergy Alert Highlighting */}
                      {item.allergyAlert && (
                        <div className="mt-2 bg-red-100 border-l-4 border-red-600 p-2.5 rounded-r-xl text-xs text-red-900 space-y-0.5">
                          <div className="font-bold uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span>ALLERGY ALERT</span>
                          </div>
                          <p className="font-semibold">{item.allergyAlert}</p>
                        </div>
                      )}

                      {/* Special Instruction */}
                      {item.itemNote && (
                        <div className="mt-1 text-xs text-gray-600 italic">
                          <span>Special instruction: "{item.itemNote}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {item.originalDish?.customizationAvailable !== false && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Customization</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 active:scale-90"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold w-6 text-center text-xs text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 active:scale-90"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-amber-700 text-base">{formatInvoiceAmount(itemTotalPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Table Special Order Notes */}
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Special Order Notes</label>
              <textarea
                rows={2}
                value={specialOrderNotes}
                onChange={(e) => setSpecialOrderNotes(e.target.value)}
                placeholder="e.g. Please bring water first, separate bill requested, etc."
                className="w-full bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 text-xs placeholder:text-gray-400 shadow-sm resize-none outline-none"
              />
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="sell" className="text-amber-600" />
                  <span className="text-xs font-bold text-gray-900">Promo Code or Voucher</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Try: DAKSHIN10</span>
              </div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div>
                    <span className="font-bold text-emerald-900">{appliedPromo.code}</span>
                    <p className="text-[10px] text-emerald-700">{appliedPromo.description}</p>
                  </div>
                  <button onClick={() => setAppliedPromo(null)} className="text-[11px] font-bold text-red-600 underline">
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
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase font-bold outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingPromo || !promoCodeInput.trim()}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-amber-700"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Mobile Billing Summary */}
            <div className="md:hidden">
              <BillingSummary
                totals={totals}
                showTipSelector={true}
                tipPercentage={tipPercentage}
                setTipPercentage={setTipPercentage}
                customTipAmount={customTipAmount}
                setCustomTipAmount={setCustomTipAmount}
                selectedTipOption={selectedTipOption}
                setSelectedTipOption={setSelectedTipOption}
              />
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex gap-4 mt-2">
              <button
                onClick={() => navigate('/menu')}
                className="flex-grow h-14 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors active:scale-95 text-sm"
              >
                Continue Ordering
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="flex-[2] h-14 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-opacity active:scale-95 shadow-md disabled:opacity-60 text-sm"
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order • ${formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}`}
              </button>
            </div>
          </div>

          {/* Right: Desktop Summary */}
          <div className="hidden md:block md:col-span-5">
            <div className="sticky top-24">
              <BillingSummary
                totals={totals}
                showTipSelector={true}
                tipPercentage={tipPercentage}
                setTipPercentage={setTipPercentage}
                customTipAmount={customTipAmount}
                setCustomTipAmount={setCustomTipAmount}
                selectedTipOption={selectedTipOption}
                setSelectedTipOption={setSelectedTipOption}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Editing Customization Modal */}
      {editingItem && (
        <CustomizationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          dish={editingItem.originalDish || editingItem}
          initialSelections={{
            selectedOptions: editingItem.selectedOptions || {},
            makeVegan: editingItem.makeVegan,
            jainPreparation: editingItem.jainPreparation,
            allergyAlert: editingItem.allergyAlert,
            specialInstruction: editingItem.itemNote,
            quantity: editingItem.quantity,
          }}
          onAddToCart={handleSaveEdit}
        />
      )}

      {/* Mobile Sticky Summary */}
      <div className="md:hidden fixed bottom-20 left-0 w-full bg-white p-4 flex flex-col gap-2 z-40 border-t border-gray-200 shadow-xl">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500">Total Payable</span>
            <span className="text-xl font-bold text-amber-700">{formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}</span>
          </div>
          <button
            onClick={() => setShowMobileDetails((s) => !s)}
            className="text-amber-700 text-xs font-semibold flex items-center gap-0.5"
          >
            Details
            <Icon name={showMobileDetails ? 'expand_more' : 'expand_less'} />
          </button>
        </div>
        {showMobileDetails && (
          <div className="flex flex-col gap-1.5 pb-2 border-b border-gray-200 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatInvoiceAmount(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatInvoiceAmount(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST @ 5%</span>
              <span>{formatInvoiceAmount(totals.gst)}</span>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-xl font-semibold active:scale-95 text-xs"
          >
            Continue
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="flex-[2] h-12 bg-amber-600 text-white rounded-xl font-bold active:scale-95 shadow-md text-xs disabled:opacity-60"
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
