import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO } from '../../utils/mockData';
import { restaurantConfig } from '../../config/restaurantConfig';
import TopAppBar from '../../components/layout/TopAppBar';
import ResponsiveImage from '../../components/common/ResponsiveImage';
import Icon from '../../components/common/Icon';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import { ArrowRight, Sparkles, ShieldCheck, Bell } from 'lucide-react';

const KITCHEN_STATUS_META = {
  NORMAL: { label: 'Kitchen is running smoothly', dot: 'bg-success' },
  BUSY: { label: 'Kitchen is moderately busy', dot: 'bg-warning' },
  VERY_BUSY: { label: 'Kitchen is very busy right now', dot: 'bg-danger' },
  PAUSED: { label: 'Kitchen has paused new orders briefly', dot: 'bg-danger' },
};

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [assistanceSent, setAssistanceSent] = useState(false);

  const statusMeta = KITCHEN_STATUS_META[kitchenLoad?.status] || KITCHEN_STATUS_META.NORMAL;
  const etaLow = kitchenLoad?.averagePreparationMinutes || 20;

  const handleAssistance = () => {
    addAssistanceRequest(tableNumber, 'GENERAL');
    setAssistanceSent(true);
    setTimeout(() => setAssistanceSent(false), 4000);
  };

  return (
    <>
      <TopAppBar
        variant="brand"
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main className="flex-1 flex flex-col pt-16 pb-10">
        {/* Upper visual anchor — not a blocking splash, just the header image */}
        <ResponsiveImage
          src={RESTAURANT_INFO.heroImage}
          alt="Mangamma Ruchulu restaurant interior"
          aspectRatio="16 / 9"
          rounded="rounded-none"
          fetchPriority="high"
          className="w-full max-h-64"
          overlay={<div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />}
        />

        <div className="w-full max-w-lg mx-auto px-5 -mt-8 relative z-10 flex flex-col gap-4">
          {/* Brand identity */}
          <div className="bg-surface-container-lowest rounded-2xl border border-border shadow-soft px-5 py-5 text-center">
            <p className="font-telugu text-2xl font-bold text-maroon-900">{RESTAURANT_INFO.nativeName}</p>
            <h1 className="text-2xl font-bold text-ink tracking-tight mt-0.5">{RESTAURANT_INFO.name}</h1>
            <p className="text-xs text-muted mt-1">{restaurantConfig.parentCompanyLabel}</p>
            <p className="text-sm text-maroon-800 font-medium italic mt-2">{RESTAURANT_INFO.tagline}</p>
          </div>

          {/* Table identity card */}
          <div className="flex items-center gap-3 bg-cream border border-border rounded-2xl px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-maroon-800 text-white flex items-center justify-center flex-shrink-0">
              <Icon name="table_restaurant" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">You are ordering for</p>
              <p className="text-sm font-bold text-ink">Table {tableNumber}</p>
            </div>
          </div>

          {/* Kitchen status */}
          <div className="flex items-center gap-3 bg-surface-container-lowest border border-border rounded-2xl px-4 py-3">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusMeta.dot}`} aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{statusMeta.label}</p>
              <p className="text-xs text-muted">Estimated {etaLow}–{etaLow + 5} minute preparation</p>
            </div>
          </div>

          {/* Primary actions */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={() => navigate('/menu')}
              className="w-full h-13 py-3.5 bg-saffron-600 hover:bg-saffron-500 text-white transition-colors rounded-2xl font-bold text-base shadow-soft flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              Explore Menu
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              onClick={() => navigate('/menu', { state: { focus: 'favourites' } })}
              className="w-full py-3 bg-cream hover:bg-sand text-text border border-border rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-saffron-600" aria-hidden="true" />
              View Popular Dishes
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-muted pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              Est. {RESTAURANT_INFO.established}
            </span>
            <span aria-hidden="true">·</span>
            <span>No login required</span>
            <span aria-hidden="true">·</span>
            <button onClick={() => setIsTrustOpen(true)} className="underline underline-offset-2 hover:text-ink">
              About Our Kitchen
            </button>
          </div>

          {/* One-tap assistance */}
          <button
            onClick={handleAssistance}
            disabled={assistanceSent}
            className="w-full py-3 mt-1 rounded-2xl border border-dashed border-maroon-700/30 text-maroon-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-saffron-100/40 transition-colors disabled:opacity-60"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {assistanceSent ? 'A waiter has been notified' : 'Need help? Call a waiter'}
          </button>
        </div>
      </main>

      {/* Modals */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
      <CustomerPreferencesModal isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />
    </>
  );
};

export default WelcomeScreen;
