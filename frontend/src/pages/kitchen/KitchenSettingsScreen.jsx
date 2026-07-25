import React from 'react';
import {
  User,
  Bell,
  Contrast,
  Monitor,
  Languages,
  LogOut
} from 'lucide-react';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-12 h-7 bg-surface-container-highest rounded-full peer-checked:bg-primary transition-colors" />
    <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
  </label>
);

const SettingsCard = ({ icon: Icon, title, children }) => (
  <section className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/40 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary-container/10 rounded-lg text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="font-headline-md text-headline-md text-lg">{title}</h2>
    </div>
    {children}
  </section>
);

const TEXT_SIZE_STEPS = ['small', 'normal', 'large'];

const KitchenSettingsScreen = ({ staffAuth, onLogoutStaff }) => {
  const { prefs, updatePref } = useKitchenPrefs();

  const textSizeIndex = Math.max(0, TEXT_SIZE_STEPS.indexOf(prefs.textSize));

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Kitchen Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Configure your display station and personal preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Profile */}
        <SettingsCard icon={User} title="Profile">
          <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shrink-0">
              {(staffAuth?.name || 'Chef').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">{staffAuth?.name || 'Kitchen Staff'}</p>
              <p className="text-xs text-on-surface-variant">Station: {staffAuth?.station || 'Main Line'}</p>
            </div>
          </div>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard icon={Bell} title="Notifications">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface">Order Alert Sounds</span>
            <Toggle
              checked={!prefs.audioMuted}
              onChange={(checked) => updatePref('audioMuted', !checked)}
            />
          </div>
        </SettingsCard>

        {/* Theme */}
        <SettingsCard icon={Contrast} title="Theme">
          <div className="flex p-1 bg-surface-container-low rounded-full">
            {['light', 'dark'].map((mode) => (
              <button
                key={mode}
                onClick={() => updatePref('theme', mode)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-bold capitalize transition-all ${
                  prefs.theme === mode
                    ? 'bg-on-surface text-surface'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </SettingsCard>

        {/* Display Settings */}
        <SettingsCard icon={Monitor} title="Display Settings">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface">Show Order Timers</span>
            <Toggle
              checked={prefs.showTimers}
              onChange={(checked) => updatePref('showTimers', checked)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Text Size</span>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={textSizeIndex}
              onChange={(e) => updatePref('textSize', TEXT_SIZE_STEPS[Number(e.target.value)])}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>Small</span>
              <span>Normal</span>
              <span>Large</span>
            </div>
          </div>
        </SettingsCard>

        {/* Language */}
        <SettingsCard icon={Languages} title="Language">
          <div className="relative">
            <select
              value={prefs.language}
              onChange={(e) => updatePref('language', e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
            >
              <option>English</option>
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </select>
          </div>
        </SettingsCard>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={onLogoutStaff}
          className="flex items-center gap-2 px-10 py-3.5 bg-primary text-on-primary rounded-full font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <p className="text-center text-xs text-on-surface-variant/60 mt-8">
        Dakshin Heritage KDS v2.4.0
      </p>
    </div>
  );
};

export default KitchenSettingsScreen;
