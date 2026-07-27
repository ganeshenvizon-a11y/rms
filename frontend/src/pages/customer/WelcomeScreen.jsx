import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO, DISHES } from '../../utils/mockData';
import TopAppBar from '../../components/layout/TopAppBar';
import Icon from '../../components/common/Icon';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';

const FEATURED_CATEGORIES = [
  { icon: 'breakfast_dining', label: 'Crispy Dosas' },
  { icon: 'rice_bowl', label: 'Soft Idlis' },
];

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const { customerMemory, saveCustomerMemory, forgetCustomerMemory, addAssistanceRequest } = useOrder();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  const accentDish = DISHES.find((d) => d.isChefSpecial && d.id !== 'dish-1') || DISHES[1];

  return (
    <>
      <TopAppBar
        variant="brand"
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main className="flex-1 flex flex-col items-center pt-16 pb-12">
        <div className="w-full max-w-[1280px] px-4 md:px-10 py-4 md:py-8 flex flex-col md:flex-row gap-6 md:gap-12 items-center">
          {/* Left Column: Visuals */}
          <div className="w-full md:w-3/5 relative group">
            <div className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.08)] bg-surface-container">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={RESTAURANT_INFO.heroImage}
                alt={RESTAURANT_INFO.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

              {/* Detected Table Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-on-surface flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Detected Table {tableNumber}</span>
              </div>

              {/* Established Badge */}
              <div className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Icon name="verified" className="text-sm" filled />
                <span>Est. {RESTAURANT_INFO.established}</span>
              </div>
            </div>

            {/* Floating Decorative Element */}
            <div className="absolute -bottom-6 -right-6 hidden lg:block w-40 h-40 rounded-xl overflow-hidden shadow-xl border-4 border-surface">
              <img className="w-full h-full object-cover" src={accentDish.image} alt={accentDish.name} />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full md:w-2/5 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6">

            <div className="space-y-1">
              <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                Traditional Flavors & Honest Cooking
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-on-surface leading-tight tracking-tight">
                Welcome to <br />
                <span className="text-primary italic">{RESTAURANT_INFO.name}</span>
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-secondary-container/10 px-4 py-2 rounded-full border border-secondary-container/20">
              <Icon name="table_restaurant" className="text-secondary" />
              <p className="text-base text-on-surface-variant">
                You are ordering from <span className="font-bold text-on-surface">Table {tableNumber}</span>
              </p>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
              {RESTAURANT_INFO.tagline}. Experience golden Ghee Roast Dosas, pillow-soft Idlis, aromatic
              Chettinad Biryanis and authentic Filter Kaapi served directly to your table.
            </p>

            <div className="w-full pt-2 flex flex-col gap-3">
              <button
                onClick={() => navigate('/menu')}
                className="w-full h-14 bg-primary-container text-on-primary hover:bg-primary transition-all duration-300 transform active:scale-95 rounded-xl font-semibold text-base shadow-lg flex items-center justify-center gap-2 group"
              >
                Start Ordering
                <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="w-full">
                <button
                  onClick={() => setIsTrustOpen(true)}
                  className="w-full py-3 px-4 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Icon name="info" className="text-primary text-base" />
                  About Our Kitchen
                </button>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-on-surface-variant/60 pt-1">
                <Icon name="verified_user" className="text-[18px]" />
                <p className="text-xs">No login required to order or pay.</p>
              </div>
            </div>

            {/* Featured Categories Preview */}
            <div className="grid grid-cols-2 gap-2 w-full pt-2">
              {FEATURED_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  onClick={() => navigate('/menu')}
                  className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1 hover:bg-surface-container-high transition-colors cursor-pointer group"
                >
                  <Icon name={cat.icon} className="text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Atmospheric Background Element */}
        <div className="fixed bottom-0 left-0 w-full h-1/2 pointer-events-none -z-10 opacity-30 overflow-hidden">
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] aspect-square bg-primary-container/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] aspect-square bg-secondary-container/10 rounded-full blur-[100px]" />
        </div>
      </main>

      {/* Modals */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
    </>
  );
};

export default WelcomeScreen;
