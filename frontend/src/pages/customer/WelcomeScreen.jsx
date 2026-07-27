import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTable } from '../../context/TableContext';
import { useOrder } from '../../context/OrderContext';
import { RESTAURANT_INFO, DISHES } from '../../utils/mockData';
import { restaurantConfig } from '../../config/restaurantConfig';
import TopAppBar from '../../components/layout/TopAppBar';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import { ArrowRight, Bell, ChevronRight, UtensilsCrossed } from 'lucide-react';

/* ─────────────────────────────────────────────
   Kitchen status metadata
───────────────────────────────────────────── */
const KITCHEN_STATUS_META = {
  NORMAL: { label: 'Kitchen is running smoothly', dot: 'bg-emerald-600' },
  BUSY: { label: 'Kitchen is moderately busy', dot: 'bg-[#B56B08]' },
  VERY_BUSY: { label: 'Kitchen is very busy right now', dot: 'bg-red-600' },
  PAUSED: { label: 'Kitchen has paused new orders briefly', dot: 'bg-red-600' },
};

/* Popular dish IDs — sourced from existing DISHES data in mockData */
const POPULAR_DISH_IDS = [
  'biryani-chicken-special',    // Special Chicken Dum Biryani — ₹300
  'mcveg-paneer-butter-masala', // Paneer Butter Masala — ₹311
  'meals-aritaku-veg',          // Aritaku Bojanam (Veg) — ₹250
];

/* ─────────────────────────────────────────────
   Sub-component: RestaurantHero
   Compact hero with bottom gradient & single identity block
───────────────────────────────────────────── */
const RestaurantHero = ({ heroImage }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden bg-[#201714]"
      style={{ height: 'clamp(195px, 52vw, 235px)' }}
    >
      {/* Actual restaurant interior photo — DO NOT replace */}
      {!heroImgFailed ? (
        <img
          src={heroImage}
          alt="Mangamma Ruchulu restaurant interior — warm dining room with hanging lights"
          fetchpriority="high"
          loading="eager"
          onError={() => setHeroImgFailed(true)}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 48%' }}
        />
      ) : (
        <div className="w-full h-full bg-[#201714] flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-[#95847C]" aria-hidden="true" />
        </div>
      )}

      {/* Controlled bottom overlay for strong text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(22, 12, 9, 0.82) 0%, rgba(22, 12, 9, 0.48) 36%, rgba(22, 12, 9, 0.08) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Single clean identity block at bottom-left — positioned higher for generous vertical breathing room */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 px-4 pb-10 flex flex-col gap-1 z-10"
        style={{ maxWidth: '90%' }}
      >
        <p
          className="font-telugu text-white font-semibold leading-tight drop-shadow-xs"
          style={{ fontSize: '20px' }}
          lang="te"
        >
          {RESTAURANT_INFO.nativeName}
        </p>
        <h1
          className="text-white font-bold tracking-tight leading-tight drop-shadow-xs"
          style={{ fontSize: '26px' }}
        >
          {RESTAURANT_INFO.name}
        </h1>
        <p
          className="text-white/90 font-medium leading-snug drop-shadow-xs"
          style={{ fontSize: '13px' }}
        >
          {RESTAURANT_INFO.tagline}
        </p>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: SessionSummaryCard
   Compact single card: table row + kitchen row
───────────────────────────────────────────── */
const SessionSummaryCard = ({ tableNumber, statusMeta, etaLow }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
    className="mx-4 relative z-20 bg-white border border-[#EADFD6] shadow-[0_8px_24px_rgba(63,34,23,0.07)]"
    style={{ marginTop: '-18px', padding: '14px 16px', borderRadius: '18px' }}
  >
    {/* Row 1: Table identity */}
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-[44px] h-[44px] rounded-full bg-[#FBECEF] text-[#A30F3B] flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <UtensilsCrossed className="w-5 h-5" />
        </div>
        <span className="text-[13px] font-medium text-[#705F58]">Your table</span>
      </div>
      <span
        className="text-[16px] font-bold text-[#211917]"
        aria-label={`You are seated at Table ${tableNumber}`}
      >
        Table {tableNumber}
      </span>
    </div>

    {/* Thin divider */}
    <div className="my-3 border-t border-[#EADFD6]" aria-hidden="true" />

    {/* Row 2: Kitchen status */}
    <div className="flex items-start gap-2.5">
      <span
        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${statusMeta.dot}`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-[#211917] leading-snug">
          {statusMeta.label}
        </p>
        <p className="text-[12px] text-[#705F58] mt-0.5">
          Estimated preparation: {etaLow}–{etaLow + 5} min
        </p>
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Sub-component: PopularDishPreviewCard
   Compact horizontal dish card with image & clear info
───────────────────────────────────────────── */
const PopularDishPreviewCard = ({ dish, onPress }) => {
  const isVeg = dish.foodType === 'VEGETARIAN';
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      onClick={onPress}
      className="w-full flex items-center gap-3 bg-white border border-[#EADFD6] shadow-[0_4px_16px_rgba(63,34,23,0.04)] text-left transition-colors hover:bg-[#FFF7EE] active:bg-[#FFF7EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 group cursor-pointer"
      style={{ borderRadius: '16px', padding: '12px', minHeight: '110px' }}
    >
      {/* Dish thumbnail */}
      <div
        className="shrink-0 overflow-hidden bg-[#F8F0E5] flex items-center justify-center"
        style={{ width: '88px', height: '88px', borderRadius: '12px' }}
      >
        {!imgFailed && dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <UtensilsCrossed className="w-8 h-8 text-[#95847C]" aria-hidden="true" />
        )}
      </div>

      {/* Dish info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="text-[15px] font-bold text-[#211917] leading-snug line-clamp-2">
          {dish.name}
        </h3>

        {/* Dietary indicator + spice */}
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`inline-flex items-center justify-center w-3.5 h-3.5 border shrink-0 ${
              isVeg ? 'border-emerald-600' : 'border-[#A30F3B]'
            }`}
            style={{ borderRadius: '3px', padding: '1px' }}
            aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
          >
            <span
              className={`block w-1.5 h-1.5 rounded-full ${
                isVeg ? 'bg-emerald-600' : 'bg-[#A30F3B]'
              }`}
            />
          </span>
          <span className="text-[12px] font-medium text-[#705F58]">
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
          {dish.spiceLevel && (
            <>
              <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
              <span className="text-[12px] font-medium text-[#705F58] capitalize">
                {dish.spiceLevel.charAt(0) + dish.spiceLevel.slice(1).toLowerCase()}
              </span>
            </>
          )}
        </div>

        {/* Price + prep time */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[15px] font-bold text-[#A30F3B]">
            ₹{dish.price}
          </span>
          <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
          <span className="text-[12px] text-[#95847C]">
            {dish.preparationTimeMinutes} min
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight
        className="w-5 h-5 text-[#95847C] shrink-0 my-auto transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </motion.button>
  );
};

/* ─────────────────────────────────────────────
   Sub-component: RestaurantTrustFooter
   Subtle secondary trust line
───────────────────────────────────────────── */
const RestaurantTrustFooter = ({ onOpenTrustProfile }) => (
  <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 px-4 py-6">
    <span className="text-[#95847C] text-[12px]">
      Since {RESTAURANT_INFO.established}
    </span>
    <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
    <span className="text-[#95847C] text-[12px]">
      {restaurantConfig.parentCompanyLabel}
    </span>
    <span className="text-[#95847C] text-[10px]" aria-hidden="true">·</span>
    <button
      onClick={onOpenTrustProfile}
      className="text-[#A30F3B] font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] rounded text-[12px] cursor-pointer"
    >
      Our Story
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   Main screen component
───────────────────────────────────────────── */
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);
  const [assistanceSent, setAssistanceSent] = useState(false);

  const statusMeta =
    KITCHEN_STATUS_META[kitchenLoad?.status] || KITCHEN_STATUS_META.BUSY;
  const etaLow = kitchenLoad?.averagePreparationMinutes || 24;

  // Resolve popular dishes from existing DISHES array — preserve existing logic
  const popularDishes = POPULAR_DISH_IDS
    .map((id) => DISHES.find((d) => d.id === id))
    .filter(Boolean);

  const handleAssistance = () => {
    addAssistanceRequest(tableNumber, 'GENERAL');
    setAssistanceSent(true);
    setTimeout(() => setAssistanceSent(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9]">
      <TopAppBar
        variant="brand"
        logoSrc={null}
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main
        className="flex-1 flex flex-col pb-10 overflow-x-hidden"
        style={{ paddingTop: 'calc(58px + env(safe-area-inset-top))' }}
      >
        <div className="w-full mx-auto flex flex-col max-w-[640px]">
          {/* ── Restaurant Hero ── */}
          <RestaurantHero heroImage={RESTAURANT_INFO.heroImage} />

          {/* ── Content stack ── */}
          <div className="flex flex-col">
            {/* Session summary card (overlaps hero by ~18px) */}
            <SessionSummaryCard
              tableNumber={tableNumber}
              statusMeta={statusMeta}
              etaLow={etaLow}
            />

            {/* Primary CTA — dominant orange button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate('/menu')}
              className="mx-4 mt-5 flex items-center justify-center gap-2 bg-[#F47712] hover:bg-[#DB5F05] active:bg-[#DB5F05] text-white font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 group cursor-pointer"
              style={{ height: '54px', borderRadius: '14px', fontSize: '16px' }}
            >
              Explore Menu
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-active:translate-x-1" aria-hidden="true" />
            </motion.button>

            {/* ── Popular dishes section ── */}
            <section
              aria-labelledby="popular-dishes-heading"
              className="px-4 mt-[26px] flex flex-col"
            >
              {/* Section heading row */}
              <div className="flex items-start justify-between gap-2 mb-[14px]">
                <div>
                  <h2
                    id="popular-dishes-heading"
                    className="font-bold text-[#211917] text-[20px] leading-tight"
                  >
                    Popular at Mangamma Ruchulu
                  </h2>
                  <p className="text-[#705F58] text-[13px] mt-1">
                    Guest favourites to help you choose quickly
                  </p>
                </div>
                <button
                  onClick={() => navigate('/menu')}
                  className="text-[#A30F3B] font-semibold text-[13px] flex items-center gap-0.5 shrink-0 hover:underline underline-offset-2 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] rounded px-1 cursor-pointer"
                  style={{ minHeight: '36px' }}
                >
                  View all
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Dish cards */}
              <div className="flex flex-col gap-3">
                {popularDishes.map((dish, i) => (
                  <motion.div
                    key={dish.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 + i * 0.07 }}
                  >
                    <PopularDishPreviewCard
                      dish={dish}
                      onPress={() => navigate(`/menu/${dish.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Trust footer ── */}
            <RestaurantTrustFooter onOpenTrustProfile={() => setIsTrustOpen(true)} />

            {/* ── One-tap waiter assistance (preserved behavior) ── */}
            <div className="px-4 pb-2">
              <button
                onClick={handleAssistance}
                disabled={assistanceSent}
                className="w-full py-3 border border-dashed border-[#A30F3B]/30 text-[#A30F3B] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#FBECEF]/40 active:bg-[#FBECEF] transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] cursor-pointer"
                style={{ borderRadius: '14px', minHeight: '48px' }}
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {assistanceSent ? 'A waiter has been notified' : 'Need help? Call a waiter'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modals — preserved behavior ── */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
      <CustomerPreferencesModal
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
      />
    </div>
  );
};

export default WelcomeScreen;
