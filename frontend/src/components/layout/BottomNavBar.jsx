import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import Icon from '../common/Icon';

const NAV_ITEMS = [
  { label: 'Menu', path: '/menu', icon: 'menu_book' },
  { label: 'Cart', path: '/cart', icon: 'shopping_bag' },
  { label: 'Orders', path: '/order-tracking', icon: 'receipt_long' },
  { label: 'Bill', path: '/bill', icon: 'payments' },
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totals } = useCart();
  const { activeOrder } = useOrder();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-stretch bg-surface border-t border-border"
      style={{ height: 'calc(64px + env(safe-area-inset-bottom))', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path === '/menu' && location.pathname.startsWith('/menu/'));
        const cartBadge = item.path === '/cart' ? totals.itemCount : 0;
        const hasActiveOrder = item.path === '/order-tracking' && !!activeOrder;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-all active:scale-90 ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="relative">
              <Icon name={item.icon} filled={isActive} className="text-[22px]" />
              {cartBadge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-secondary-container text-on-secondary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartBadge}
                </span>
              )}
              {hasActiveOrder && cartBadge === 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </span>
            <span className="text-[11px] font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
