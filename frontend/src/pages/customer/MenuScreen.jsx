import React, { useState, useEffect } from 'react';
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
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Star } from 'lucide-react';

const MenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Customization modal state
  const [customizingDish, setCustomizingDish] = useState(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  // Trust & Preference Modal States
  const [isTrustOpen, setIsTrustOpen] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  const { addToCart } = useCart();
  const { tableNumber } = useTable();
  const { kitchenLoad, customerMemory, saveCustomerMemory, forgetCustomerMemory, addAssistanceRequest } = useOrder();
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
      const fetched = res.data || [];
      setDishes(fetched);
      if (selectedCategory === 'all' && !searchQuery) {
        setAllDishes(fetched);
      }
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

  const handleOpenCustomize = (dish) => {
    if (dish.availabilityStatus === 'SOLD_OUT') {
      showToast(`${dish.name} is currently sold out`, 'warning');
      return;
    }
    setCustomizingDish(dish);
    setIsCustomizationOpen(true);
  };

  const handleAddToCartFromModal = (payload) => {
    const { dish, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(
      dish,
      formattedModifiers,
      specialInstruction,
      quantity,
      {
        selectedOptions,
        makeVegan,
        jainPreparation,
        allergyAlert,
      }
    );
    showToast(`Added customized ${dish.name} (x${quantity}) to cart`, 'success');
  };

  const newGuestDishes = (allDishes.length > 0 ? allDishes : dishes)
    .filter((d) => d.newCustomerRecommendation)
    .slice(0, 4);

  return (
    <>
      <TopAppBar
        variant="brand"
        onOpenTrustProfile={() => setIsTrustOpen(true)}
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main className="flex-1 pb-40 pt-20 px-4 max-w-screen-xl mx-auto w-full">
        {/* Kitchen Expectation Banner */}
        <section className="mt-2">
          <HonestExpectationBanner
            kitchenLoad={kitchenLoad}
            estimatedRange={`${kitchenLoad?.averagePreparationMinutes || 20}–${(kitchenLoad?.averagePreparationMinutes || 20) + 5} mins`}
          />
        </section>

        {/* Search Bar */}
        <section className="mt-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} />
        </section>

        {/* New Here? Curated Guidance Section */}
        {selectedCategory === 'all' && !searchQuery && newGuestDishes.length > 0 && (
          <section className="mt-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-gray-900">New here? Try these</h2>
            </div>
            <p className="text-xs text-gray-600 mb-3">Popular, approachable dishes selected for first-time guests</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {newGuestDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => handleOpenCustomize(dish)}
                  className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm hover:shadow transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="flex gap-3 items-center">
                    <img src={dish.image} alt={dish.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-xs text-gray-900">{dish.name}</h3>
                      <p className="text-[11px] text-amber-800 italic mt-0.5 line-clamp-2">
                        "{dish.newCustomerReason || 'A guest favorite'}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 text-xs">
                    <span className="font-bold text-amber-700">₹{dish.price}</span>
                    <span className="text-amber-800 font-semibold text-[11px] flex items-center gap-0.5">
                      <span>Order This</span> <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Chips */}
        {categories.length === 0 && isLoading ? (
          <CategorySkeletonRow />
        ) : (
          <section className="mt-6 overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2 py-2">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </section>
        )}

        {/* Results Count & Kitchen Trust Action */}
        <div className="flex items-center justify-between pt-4 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-on-surface">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Full Menu'}
            </h2>
            <button
              onClick={() => setIsTrustOpen(true)}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <Icon name="info" className="text-sm" />
              <span>About Kitchen</span>
            </button>
          </div>
          <span className="text-xs text-on-surface-variant font-semibold bg-surface-container-high px-2.5 py-1 rounded-full">
            {dishes.length} {dishes.length === 1 ? 'Dish' : 'Dishes'}
          </span>
        </div>

        {/* Dish List */}
        {isLoading ? (
          <MenuSkeletonList count={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMenuData} />
        ) : dishes.length === 0 ? (
          <EmptyState
            icon={() => <Icon name="tune" className="text-4xl" />}
            title="No dishes found"
            description={`No dishes match "${searchQuery || selectedCategory}". Try searching for another item or clear your filters.`}
            actionLabel="Clear Filters"
            onAction={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
          />
        ) : (
          <section className="mt-2 flex flex-col gap-4">
            {dishes.map((dish) => (
              <FoodCard key={dish.id} dish={dish} onCustomize={handleOpenCustomize} />
            ))}
          </section>
        )}
      </main>

      {/* Customization Modal */}
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

      {/* Modals */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      <StickyCartBar />
      <BottomNavBar />
    </>
  );
};

export default MenuScreen;
