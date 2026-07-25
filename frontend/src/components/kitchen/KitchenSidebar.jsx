import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  LayoutDashboard,
  History,
  ChefHat,
  BellRing,
  Settings,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/kitchen', end: true, label: 'Live Dashboard', icon: LayoutDashboard },
  { to: '/kitchen/history', end: false, label: 'Order History', icon: History },
  { to: '/kitchen/summary', end: false, label: 'Item Summary', icon: ChefHat },
  { to: '/kitchen/assistance', end: false, label: 'Assistance Calls', icon: BellRing, badgeKey: 'assistance' },
  { to: '/kitchen/settings', end: false, label: 'Settings', icon: Settings },
];

const KitchenSidebar = ({ pendingCallsCount = 0, onResetData }) => {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 shrink-0 p-4 gap-2 border-r border-outline-variant/30 bg-surface-container-lowest">
      <button
        onClick={() => navigate('/portal')}
        className="flex items-center gap-1.5 px-2 py-1.5 -ml-1 mb-4 w-fit rounded-lg text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
        title="Return to System Launchpad"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Portal</span>
      </button>

      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-primary tracking-tight">{RESTAURANT_INFO.name}</h1>
        <p className="text-xs text-on-surface-variant opacity-70">Kitchen Display System</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, end, label, icon: Icon, badgeKey }) => {
          const badgeCount = badgeKey === 'assistance' ? pendingCallsCount : 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                  {badgeCount > 0 && (
                    <span className="ml-auto text-[10px] font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded-full">
                      {badgeCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {onResetData && (
        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      )}
    </aside>
  );
};

export default KitchenSidebar;
