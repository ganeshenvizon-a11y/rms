import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import Icon from '../common/Icon';

/**
 * Material-style top app bar with Trust Profile and Saved Preferences secondary actions.
 */
const TopAppBar = ({
  variant = 'brand',
  title,
  onBack,
  rightIcon,
  onRightAction,
  transparent = false,
  onOpenTrustProfile,
  onOpenPreferences
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
        <span className="font-bold text-lg tracking-tight text-primary italic truncate max-w-[45%]">
          {title || RESTAURANT_INFO.name}
        </span>
        <div className="flex items-center gap-2">
          {onOpenTrustProfile && (
            <button
              onClick={onOpenTrustProfile}
              className="px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary flex items-center gap-1 transition-colors"
              title="About Our Kitchen"
            >
              <Icon name="info" className="text-sm" />
              <span className="hidden sm:inline">About Kitchen</span>
            </button>
          )}
          {rightIcon ? (
            <button
              onClick={onRightAction}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <Icon name={rightIcon} className="text-on-surface" />
            </button>
          ) : (
            <span className="w-2" />
          )}
        </div>
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
        <h1 className="text-lg font-bold italic text-primary tracking-tight truncate max-w-[180px] sm:max-w-none">
          {RESTAURANT_INFO.name}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {onOpenTrustProfile && (
          <button
            onClick={onOpenTrustProfile}
            className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary flex items-center gap-1 transition-colors"
          >
            <Icon name="verified_user" className="text-sm" />
            <span className="hidden sm:inline">About Our Kitchen</span>
          </button>
        )}
        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          Table {tableNumber}
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
