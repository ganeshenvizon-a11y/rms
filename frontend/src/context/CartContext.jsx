import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getStoredCart, setStoredCart, clearStoredCart } from '../utils/storage';
import { calculateCartTotals } from '../utils/formatters';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [tipPercentage, setTipPercentage] = useState(10); // Default 10% tip
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [specialOrderNotes, setSpecialOrderNotes] = useState('');

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    setStoredCart(cartItems);
  }, [cartItems]);

  // Compute subtotal, taxes, grandTotal dynamically
  const totals = useMemo(() => {
    const rawTotals = calculateCartTotals(cartItems, tipPercentage);
    
    let discountAmount = 0;
    if (appliedPromo && appliedPromo.discountPercent) {
      discountAmount = (rawTotals.subtotal * appliedPromo.discountPercent) / 100;
    }

    const grandTotalAfterDiscount = Math.max(0, rawTotals.grandTotal - discountAmount);

    return {
      ...rawTotals,
      discountAmount,
      grandTotal: grandTotalAfterDiscount,
    };
  }, [cartItems, tipPercentage, appliedPromo]);

  // Add item to cart or increment if identical item (same dish id + same customizations + same itemNote) exists
  const addToCart = (dish, selectedCustomizations = [], note = '', initialQuantity = 1) => {
    setCartItems((prevItems) => {
      const customKey = JSON.stringify({
        customizations: (selectedCustomizations || []).map(c => c.name).sort(),
        note: (note || '').trim()
      });
      const existingIndex = prevItems.findIndex(
        (item) => item.id === dish.id && JSON.stringify({
          customizations: (item.selectedCustomizations || []).map(c => c.name).sort(),
          note: (item.itemNote || '').trim()
        }) === customKey
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + initialQuantity,
        };
        return updated;
      } else {
        const cartItemId = `${dish.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        return [
          ...prevItems,
          {
            cartItemId,
            id: dish.id,
            name: dish.name,
            italianName: dish.italianName,
            price: dish.price,
            image: dish.image,
            isVeg: dish.isVeg,
            quantity: initialQuantity,
            selectedCustomizations: selectedCustomizations || [],
            itemNote: note || '',
          },
        ];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId || item.id === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove item by ID or cartItemId
  const removeFromCart = (targetId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== targetId && item.id !== targetId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
    setSpecialOrderNotes('');
    clearStoredCart();
  };

  // Quick helper: check quantity of dish in cart by dish id
  const getDishQuantityInCart = (dishId) => {
    return cartItems
      .filter((item) => item.id === dishId)
      .reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getDishQuantityInCart,
        tipPercentage,
        setTipPercentage,
        appliedPromo,
        setAppliedPromo,
        specialOrderNotes,
        setSpecialOrderNotes,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
