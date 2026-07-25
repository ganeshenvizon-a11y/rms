import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../common/Icon';

/**
 * Material-style top app bar. Two variants matching the reference screens:
 * - "brand": restaurant name + table badge (Menu, Cart, Bill, Payment, Tracking)
 * - "back": back button + optional title + optional right action (Food Details, Order Confirmation, Thank You)
 */
const TopAppBar = ({
  variant = 'brand',
  title,
  onBack,
  rightIcon,
  onRightAction,
  transparent = false,
}) => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();

  if (variant === 'back') {
    return (
      <header
        className={`fixed top-0 left-0 w-full z-40 h-16 flex items-center justify-between px-4 ${
          transparent ? 'bg-transparent' : 'bg-surface/80 backdrop-blur-md'
        }`}
      >
        <button
          onClick={onBack || (() => navigate(-1))}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm"
          aria-label="Go back"
        >
          <Icon name="arrow_back" className="text-on-surface" />
        </button>
        <span className="font-bold text-lg tracking-tight text-primary italic truncate max-w-[55%]">
          {title || RESTAURANT_INFO.name}
        </span>
        {rightIcon ? (
          <button
            onClick={onRightAction}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            <Icon name={rightIcon} className="text-on-surface" />
          </button>
        ) : (
          <span className="w-10 h-10" />
        )}
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 md:px-10 h-16">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <Icon name="restaurant" className="text-primary" />
        <h1 className="text-lg font-bold italic text-primary tracking-tight">
          {RESTAURANT_INFO.name}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold">
          Table {tableNumber}
        </div>
        <button
          onClick={() => navigate('/portal')}
          title="Staff Portal"
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant/50 hover:text-primary hover:bg-surface-container transition-colors"
        >
          <Icon name="admin_panel_settings" className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default TopAppBar;
