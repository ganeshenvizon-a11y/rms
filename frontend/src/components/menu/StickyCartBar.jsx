import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatInvoiceAmount } from '../../utils/formatters';
import Icon from '../common/Icon';

const StickyCartBar = () => {
  const navigate = useNavigate();
  const { totals } = useCart();

  if (totals.itemCount <= 0) return null;

  return (
    <div
      className="fixed left-0 w-full z-40 px-4"
      style={{ bottom: 'calc(64px + env(safe-area-inset-bottom) + 12px)' }}
    >
      <div
        onClick={() => navigate('/cart')}
        className="max-w-md mx-auto bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-between p-4 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="relative bg-white/20 p-2 rounded-xl">
            <Icon name="shopping_bag" className="text-2xl" />
            <span className="absolute -top-1 -right-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totals.itemCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold opacity-70">
              {totals.itemCount} {totals.itemCount === 1 ? 'Item' : 'Items'} in Cart
            </span>
            <span className="font-bold text-xl">{formatInvoiceAmount(totals.totalPayable || totals.grandTotal)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white text-primary px-5 py-3 rounded-xl font-bold">
          <span>View Cart</span>
          <Icon name="arrow_forward" className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
