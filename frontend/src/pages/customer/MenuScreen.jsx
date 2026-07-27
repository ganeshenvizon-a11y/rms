import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import CategoryChip from '../../components/menu/CategoryChip';
import SearchBar from '../../components/menu/SearchBar';
import FoodCard from '../../components/menu/FoodCard';
import StickyCartBar from '../../components/menu/StickyCartBar';
import CustomizationModal from '../../components/menu/CustomizationModal';
import HonestExpectationBanner from '../../components/order/HonestExpectationBanner';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import { MenuSkeletonList, CategorySkeletonRow } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Icon from '../../components/common/Icon';
import { DISHES, FAVOURITE_DISH_IDS, NEW_GUEST_DISH_IDS } from '../../utils/mockData';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles } from 'lucide-react';

const QUICK_FILTERS = [
  { id: 'veg', label: 'Vegetarian', test: (d) => d.foodType === 'VEGETARIAN' },
  { id: 'nonveg', label: 'Non-Vegetarian', test: (d) => d.foodType === 'NON_VEGETARIAN' },
  { id: 'egg', label: 'Egg', test: (d) => d.containsEgg },
  { id: 'mild', label: 'Mild', test: (d) => d.spiceLevel === 'MILD' },
  { id: 'spicy', label: 'Spicy', test: (d) => d.spiceLevel === 'SPICY' },
  { id: 'jain', label: 'Jain Option', test: (d) => d.jainAvailable },
  { id: 'available', label: 'Available Now', test: (d) => d.availabilityStatus === 'AVAILABLE' },
  { id: 'under20', label: 'Under 20 Minutes', test: (d) => (d.preparationTimeMinutes || 99) <= 20 },
];

const MenuScreen = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customizingDish, setCustomizingDish] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  const favouritesRef = useRef(null);

  const { addToCart } = useCart();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { showToast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await menuService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories', err);
      }
    };
    loadCategories();
  }, []);

  const fetchMenuData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await menuService.getMenu(selectedCategory, searchQuery);
      setDishes(res.data || []);
    } catch (err) {
      setError('Failed to load menu dishes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenuData();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (location.state?.focus === 'favourites' && favouritesRef.current) {
      setTimeout(() => favouritesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
  }, [location.state]);

  const toggleFilter = (id) => {
    setActiveFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const visibleDishes = dishes.filter((d) =>
    activeFilters.every((fid) => QUICK_FILTERS.find((f) => f.id === fid)?.test(d))
  );

  const favouriteDishes = FAVOURITE_DISH_IDS.map((id) => DISHES.find((d) => d.id === id)).filter(Boolean);
  const newGuestDishes = NEW_GUEST_DISH_IDS.map((id) => DISHES.find((d) => d.id === id)).filter(Boolean);

  const handleOpenCustomize = (dish) => {
    if (dish.availabilityStatus === 'SOLD_OUT') {
      showToast(`${dish.name} is currently sold out`, 'warning');
      return;
    }
    if (dish.orderableInApp === false) {
      showToast(`${dish.name} is priced at MRP — please ask your server`, 'info');
      return;
    }
    setCustomizingDish(dish);
    setIsCustomizationOpen(true);
  };

  const handleAddToCartFromModal = (payload) => {
    const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(dish, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
    showToast(`Added customized ${dish.name} (x${quantity}) to cart`, 'success');
  };

  const showCuratedSections = selectedCategory === 'all' && !searchQuery && activeFilters.length === 0;

  return (
    <>
      <TopAppBar variant="brand" onOpenTrustProfile={() => setIsTrustOpen(true)} onOpenPreferences={() => setIsPrefsOpen(true)} />

      <main className="flex-1 pb-40 pt-20 px-4 max-w-screen-xl mx-auto w-full">
        <section className="mt-2">
          <HonestExpectationBanner
            kitchenLoad={kitchenLoad}
            estimatedRange={`${kitchenLoad?.averagePreparationMinutes || 20}–${(kitchenLoad?.averagePreparationMinutes || 20) + 5} mins`}
          />
        </section>

        <section className="mt-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} />
        </section>

        {/* Quick dietary & availability filters */}
        <section className="mt-3 overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2 py-1">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => toggleFilter(f.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeFilters.includes(f.id)
                  ? 'bg-maroon-800 text-white border-maroon-800'
                  : 'bg-surface-container-lowest text-on-surface-variant border-border hover:bg-surface-container'
              }`}
            >
              {f.label}
            </button>
          ))}
        </section>

        {/* Category rail */}
        {categories.length === 0 && isLoading ? (
          <CategorySkeletonRow />
        ) : (
          <section className="mt-4 overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2 py-2">
            {categories.map((cat) => (
              <CategoryChip key={cat.id} category={cat} isActive={selectedCategory === cat.id} onClick={() => setSelectedCategory(cat.id)} />
            ))}
          </section>
        )}

        {/* New here? */}
        {showCuratedSections && newGuestDishes.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-saffron-600" />
              <h2 className="text-base font-bold text-ink">New here? Try these</h2>
            </div>
            <p className="text-xs text-muted mb-3">Approachable dishes selected for first-time guests</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {newGuestDishes.map((dish) => (
                <FoodCard key={dish.id} dish={dish} variant="compact" onCustomize={handleOpenCustomize} />
              ))}
            </div>
          </section>
        )}

        {/* Mangamma Favourites */}
        {showCuratedSections && favouriteDishes.length > 0 && (
          <section ref={favouritesRef} className="mt-8 scroll-mt-20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-maroon-800" />
              <h2 className="text-base font-bold text-ink">Mangamma Favourites</h2>
            </div>
            <p className="text-xs text-muted mb-3">Signature dishes our guests reorder most</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {favouriteDishes.map((dish) => (
                <FoodCard key={dish.id} dish={dish} variant="featured" onCustomize={handleOpenCustomize} />
              ))}
            </div>
          </section>
        )}

        {/* Results Count & Kitchen Trust Action */}
        <div className="flex items-center justify-between pt-6 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-on-surface">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Full Menu'}
            </h2>
            <button onClick={() => setIsTrustOpen(true)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <Icon name="info" className="text-sm" />
              <span>About Kitchen</span>
            </button>
          </div>
          <span className="text-xs text-on-surface-variant font-semibold bg-surface-container-high px-2.5 py-1 rounded-full">
            {visibleDishes.length} {visibleDishes.length === 1 ? 'Dish' : 'Dishes'}
          </span>
        </div>

        {/* Dish List */}
        {isLoading ? (
          <MenuSkeletonList count={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMenuData} />
        ) : visibleDishes.length === 0 ? (
          <EmptyState
            icon={() => <Icon name="tune" className="text-4xl" />}
            title="No dishes found"
            description={`No dishes match "${searchQuery || selectedCategory}". Try searching for another item or clear your filters.`}
            actionLabel="Clear Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setActiveFilters([]);
            }}
          />
        ) : (
          <section className="mt-2 flex flex-col gap-3">
            {visibleDishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />
            ))}
          </section>
        )}
      </main>

      {customizingDish && (
        <CustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => {
            setIsCustomizationOpen(false);
            setCustomizingDish(null);
          }}
          dish={customizingDish}
          onAddToCart={handleAddToCartFromModal}
        />
      )}

      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />
      <CustomerPreferencesModal isOpen={isPrefsOpen} onClose={() => setIsPrefsOpen(false)} />

      <StickyCartBar />
      <BottomNavBar />
    </>
  );
};

export default MenuScreen;
