import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Bell, Wifi, Settings, UserCheck, LogOut } from 'lucide-react';

const KitchenNavbar = ({ staffAuth, onLogoutStaff, pendingCallsCount = 0 }) => {
  const navigate = useNavigate();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-sm shrink-0 z-30">
      <div
        onClick={() => navigate('/kitchen')}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <Flame className="w-[18px] h-[18px]" />
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary leading-none">
            Dakshin Heritage KDS
          </h1>
          <p className="text-[11px] text-on-surface-variant font-medium tracking-wide hidden sm:block">
            Kitchen Display Portal
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-sm font-bold">
          {timeString}
        </div>

        <button
          onClick={() => navigate('/kitchen/assistance')}
          className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant"
          title="Assistance Calls"
        >
          <Bell className="w-5 h-5" />
          {pendingCallsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error border-2 border-surface-container-lowest rounded-full" />
          )}
        </button>

        <span className="hidden sm:inline-flex p-2 rounded-full text-emerald-600" title="Live Sync Connected">
          <Wifi className="w-5 h-5" />
        </span>

        <button
          onClick={() => navigate('/kitchen/settings')}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95 text-on-surface-variant"
          title="Kitchen Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {staffAuth && (
          <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-outline-variant">
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <UserCheck className="w-4 h-4" />
            </div>
            <button
              onClick={onLogoutStaff}
              className="p-2 rounded-full hover:bg-error-container/50 text-error transition-colors active:scale-95"
              title="Logout Kitchen Staff"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default KitchenNavbar;
