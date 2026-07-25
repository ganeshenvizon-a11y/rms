import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, BellOff, CalendarDays, UserCircle2 } from 'lucide-react';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const KitchenTopBar = ({
  title,
  subtitle,
  showSearch = true,
  searchPlaceholder = 'Search table, order #, or dish...',
  staffAuth
}) => {
  const navigate = useNavigate();
  const { prefs, updatePref } = useKitchenPrefs();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const initials = (staffAuth?.name || 'Chef')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between gap-4 h-16 px-6 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0 shadow-sm">
      <div className="flex items-center gap-4 min-w-0">
        {title ? (
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-primary leading-tight truncate">{title}</h2>
            {subtitle && <p className="text-xs text-on-surface-variant truncate">{subtitle}</p>}
          </div>
        ) : (
          showSearch && (
            <div className="relative w-full max-w-md hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/30 text-sm outline-none"
              />
            </div>
          )
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updatePref('audioMuted', !prefs.audioMuted)}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          title={prefs.audioMuted ? 'Unmute order alert sound' : 'Order alert sound enabled'}
        >
          {prefs.audioMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        </button>
        <button
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors hidden sm:flex"
          title={now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        >
          <CalendarDays className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate('/kitchen/settings')}
          className="p-1 ml-1 rounded-full border-2 border-primary/10 hover:border-primary/40 transition-colors"
          title="Kitchen Settings"
        >
          {staffAuth ? (
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
              {initials}
            </span>
          ) : (
            <UserCircle2 className="w-8 h-8 text-primary" />
          )}
        </button>
      </div>
    </header>
  );
};

export default KitchenTopBar;
