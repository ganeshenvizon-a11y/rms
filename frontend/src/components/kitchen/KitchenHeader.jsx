import React from 'react';
import { Search, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useKitchenPrefs } from '../../context/KitchenPrefsContext';

const STATIONS = [
  { id: 'All', label: 'All Stations' },
  { id: 'Dosa & Tiffin Station', label: 'Dosa & Tiffins' },
  { id: 'Biryani & Rice Station', label: 'Biryani & Rice' },
  { id: 'Curry & Sambar Station', label: 'Curries & Gravies' },
  { id: 'Vada & Appetizer Station', label: 'Vadas & Starters' },
  { id: 'Beverage & Dessert Station', label: 'Filter Kaapi & Sweets' }
];

const KitchenHeader = ({
  selectedStation,
  setSelectedStation,
  searchQuery,
  setSearchQuery,
  onResetData
}) => {
  const { prefs, updatePref } = useKitchenPrefs();

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Station Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
        {STATIONS.map((station) => {
          const isSelected = selectedStation === station.id;
          return (
            <button
              key={station.id}
              onClick={() => setSelectedStation(station.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              {station.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Search Bar */}
        <div className="relative flex-1 sm:w-56">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Table or #ORD..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => updatePref('audioMuted', !prefs.audioMuted)}
          className={`p-2 rounded-lg border transition-colors ${
            prefs.audioMuted
              ? 'bg-surface-container-lowest text-on-surface-variant/50 border-outline-variant'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
          title={prefs.audioMuted ? 'Unmute Order Alert Sound' : 'Order Alert Sound Enabled'}
        >
          {prefs.audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onResetData}
          className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors"
          title="Reset Demo Tickets"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default KitchenHeader;
