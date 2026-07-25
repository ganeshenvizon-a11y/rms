import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChefHat,
  LayoutDashboard,
  History,
  BellRing,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/kitchen', end: true, label: 'Live Dashboard', icon: LayoutDashboard },
  { to: '/kitchen/history', end: false, label: 'Order History', icon: History },
  { to: '/kitchen/summary', end: false, label: 'Item Summary', icon: ChefHat },
  { to: '/kitchen/assistance', end: false, label: 'Assistance Calls', icon: BellRing, badgeKey: 'assistance' },
  { to: '/kitchen/settings', end: false, label: 'Settings', icon: Settings },
];

const KitchenSidebar = ({ pendingCallsCount = 0 }) => {
  return (
    <aside className="hidden md:flex flex-col h-full w-72 shrink-0 bg-[#fbf8f8] border-r border-outline-variant">
      <div className="flex flex-col h-full p-4 gap-6">
        {/* Brand Identity */}
        <div className="flex gap-3 items-center">
          <div className="size-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
            <ChefHat className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-on-surface text-base font-bold leading-normal">Dakshin Heritage</h1>
            <p className="text-outline text-sm font-normal leading-normal">Kitchen Dashboard</p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const badgeCount = item.badgeKey === 'assistance' ? pendingCallsCount : 0;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#f2e8e8] text-primary'
                      : 'text-on-surface hover:bg-surface-container'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ItemIcon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-on-surface'}`} />
                    <p className={`text-sm flex-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</p>
                    {badgeCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-error text-on-error text-[10px] font-bold leading-none">
                        {badgeCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Kitchen Status */}
        <div className="mt-auto p-4 bg-primary-container/10 rounded-xl">
          <p className="text-xs font-bold text-primary tracking-wider uppercase mb-1">Kitchen Status</p>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-on-surface">Kitchen Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default KitchenSidebar;
