import React from 'react';
import { Search } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import Icon from '../common/Icon';

const STATIONS = [
  { id: 'All', label: 'All Stations' },
  { id: 'MY_STATION', label: 'My Station' },
  { id: 'DOSA_STATION', label: 'Dosa Station' },
  { id: 'TANDOOR', label: 'Tandoor' },
  { id: 'CURRY_STATION', label: 'Curry Station' },
  { id: 'BIRYANI_STATION', label: 'Biryani Station' },
  { id: 'FRY_STATION', label: 'Fry Station' },
  { id: 'BEVERAGE_STATION', label: 'Beverage Station' },
  { id: 'DESSERT_STATION', label: 'Dessert Station' },
  { id: 'PACKING_STATION', label: 'Packing Station' }
];

const KITCHEN_FILTERS = [
  { id: 'ALL_FILTERS', label: 'All Items' },
  { id: 'FILTER_DELAYED', label: 'Delayed ⚠️' },
  { id: 'FILTER_ALLERGY', label: 'Allergy Alerts 🛑' },
  { id: 'FILTER_REFIRE', label: 'Re-fire 🔥' },
  { id: 'FILTER_READY', label: 'Ready ✅' }
];

const KitchenHeader = ({
  selectedStation,
  setSelectedStation,
  searchQuery,
  setSearchQuery
}) => {
  const { kitchenLoad, updateKitchenLoadStatus } = useOrder();

  return (
    <div className="flex flex-col gap-3">
      {/* Kitchen Load Operational Control Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Icon name="speed" className="text-primary text-base" />
          <span className="font-bold text-on-surface">Kitchen Load Operational State:</span>
          <span className="text-on-surface-variant italic">({kitchenLoad?.customerMessage})</span>
        </div>

        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20">
          {[
            { id: 'NORMAL', label: 'Normal' },
            { id: 'BUSY', label: 'Busy' },
            { id: 'VERY_BUSY', label: 'Very Busy' },
            { id: 'PAUSED', label: 'Paused' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => updateKitchenLoadStatus(st.id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                kitchenLoad?.status === st.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Station Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {STATIONS.map((station) => {
            const isSelected = selectedStation === station.id;
            return (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                }`}
              >
                {station.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Table or #ORD..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
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
      </div>
    </div>
  );
};

export default KitchenHeader;
