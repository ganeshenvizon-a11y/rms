import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import {
  UtensilsCrossed,
  LayoutDashboard,
  BookOpen,
  Grid,
  Badge,
  BarChart3,
  Bell,
  Settings,
  CircleUserRound,
  LogOut,
  Search,
  CalendarDays,
  CreditCard,
  ArrowLeftCircle,
  RefreshCw,
  Users,
  LayoutGrid
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu & Categories', icon: BookOpen },
  { id: 'tables', label: 'Tables', icon: Grid },
  { id: 'guestflow', label: 'Guest Flow', icon: Users },
  { id: 'employee', label: 'Employees', icon: Badge },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: CircleUserRound },
];

const ManagerLayout = ({ children, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { resetKitchenDemoData } = useOrder();
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-outline-variant bg-surface-container-lowest flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-on-surface font-bold text-lg leading-tight">{RESTAURANT_INFO.name}</h1>
            <p className="text-on-surface-variant text-xs font-medium">Manager Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant space-y-2">
          {/* App Hub — prominent switcher */}
          <button
            onClick={() => navigate('/portal')}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold transition-all border border-primary/20"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm">Switch App / Portal Hub</span>
          </button>

          <button
            onClick={resetKitchenDemoData}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Reset Demo Data</span>
          </button>
          <button
            onClick={() => navigate('/portal')}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-error hover:bg-error/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <main className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for orders, tables, or staff..."
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 h-10 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right mr-2">
              <span className="text-sm font-bold text-on-surface">Sundaram Pillai</span>
              <span className="text-xs text-on-surface-variant">General Manager</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/counter')}
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Open Counter POS"
              >
                <CreditCard className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-surface-container-lowest" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
                title="Today's Schedule"
              >
                <CalendarDays className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/portal')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-sm"
                title="Return to App Hub"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>App Hub</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-full border-2 border-outline-variant overflow-hidden shrink-0"
              title="Manager Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Manager Avatar"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};

export default ManagerLayout;
