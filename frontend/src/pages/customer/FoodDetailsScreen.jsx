import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { formatMenuPrice } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import CustomizationModal from '../../components/menu/CustomizationModal';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import { Sparkles, Clock, ChevronRight, Plus, BookOpen, ShieldAlert, AlertTriangle } from 'lucide-react';

const FoodDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { tableNumber } = useTable();
  const { kitchenLoad, addAssistanceRequest } = useOrder();
  const { showToast } = useToast();

  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await menuService.getDishById(id);
        setDish(res.data);
      } catch (err) {
        setError('Dish details could not be found.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDish();
  }, [id]);

  if (isLoading) return <LoadingSkeleton />;
  if (error || !dish) return <ErrorState message={error} onRetry={() => navigate('/menu')} />;

  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const prepTimeMin = dish.preparationTimeMinutes || 15;
  const isDelayedDish = prepTimeMin >= 30 || kitchenLoad?.status === 'BUSY' || kitchenLoad?.status === 'VERY_BUSY';

  const handleAddToCartFromModal = (payload) => {
    const { dish: d, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(
      d,
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
    showToast(`Added ${d.name} (x${quantity}) to cart`, 'success');
    navigate('/menu');
  };

  const handleDirectAddToCart = () => {
    addToCart(dish);
    showToast(`Added "${dish.name}" to cart`, 'success');
    navigate('/menu');
  };

  const handleAddPairing = (pairing) => {
    const pairingDish = {
      id: pairing.itemId || `pairing-${Date.now()}`,
      name: pairing.name,
      price: pairing.price,
      image: pairing.image || dish.image,
      customizationAvailable: false,
    };
    addToCart(pairingDish);
    showToast(`Added pairing "${pairing.name}" to cart`, 'success');
  };

  return (
    <>
      <TopAppBar
        variant="back"
        transparent
        onOpenTrustProfile={() => setIsTrustOpen(true)}
      />

      <main className="flex-1 pb-40 max-w-3xl mx-auto w-full">
        {/* 1. Image */}
        <section className="relative w-full h-[45vh] sm:h-[50vh] overflow-hidden">
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end">
            <div>
              <span className="text-xs bg-amber-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {dish.portionLabel || 'Regular'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black mt-1 leading-tight">{dish.name}</h1>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatMenuPrice(dish.price)}
            </div>
          </div>
        </section>

        <article className="px-4 py-6 space-y-6 text-sm">
          {/* Honest Preparation Expectations */}
          {isDelayedDish && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Longer preparation time</span>
              </div>
              <p className="text-xs leading-relaxed">
                This item currently takes approximately <strong>{prepTimeMin}–{prepTimeMin + 5} minutes</strong> due to kitchen volume. Other items in your order may be ready earlier.
              </p>
            </div>
          )}

          {/* 2 & 3. Short Description */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/80">
            <p className="text-gray-800 text-base font-medium leading-relaxed">
              {dish.shortDescription || dish.description}
            </p>
          </div>

          {/* 4. Food Type & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
              <span>{dish.foodType === 'VEGAN' ? '🌱' : dish.foodType === 'NON_VEGETARIAN' ? '🍗' : dish.foodType === 'CONTAINS_EGG' ? '🥚' : '🟢'}</span>
              <span>{dish.foodType || 'VEGETARIAN'}</span>
            </span>

            {/* 5. Spice level */}
            {dish.spiceLevel && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 border border-orange-200 font-bold text-xs flex items-center gap-1.5">
                <span>🌶</span>
                <span>{dish.spiceLevel} Spice</span>
              </span>
            )}

            {/* 6. Prep Time Range */}
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium text-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Expected prep: {prepTimeMin}–{prepTimeMin + 5} mins</span>
            </span>

            {/* 7. Portion and Serving */}
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 font-medium text-xs">
              Portion: {dish.portionLabel || 'Regular'} · Serves {dish.serves || '1 person'}
            </span>
          </div>

          {/* 8. Availability */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="font-semibold text-gray-700">Availability Status:</span>
            <span className={`font-bold ${isAvailable ? 'text-emerald-700' : 'text-red-600'}`}>
              {dish.availabilityStatus === 'AVAILABLE'
                ? 'Available Now'
                : dish.availabilityStatus === 'LIMITED_AVAILABILITY'
                ? 'Limited Availability (Few portions left)'
                : dish.availabilityStatus === 'SOLD_OUT'
                ? 'Sold Out Today'
                : 'Temporarily Unavailable'}
            </span>
          </div>

          {/* 9. Allergens & Gluten Information with Kitchen Policy Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-700" /> Allergens & Allergy Policy
              </h3>
              <button
                type="button"
                onClick={() => setIsTrustOpen(true)}
                className="text-[11px] font-bold text-amber-800 underline"
              >
                Read Kitchen Policy
              </button>
            </div>
            <p className="text-xs text-amber-900">
              <strong>Gluten Status:</strong> {dish.glutenStatus || 'Gluten status unavailable'}
            </p>
            <p className="text-xs text-amber-900">
              <strong>Allergens Present:</strong> {dish.allergens?.length > 0 ? dish.allergens.join(', ') : 'None listed'}
            </p>
            <div className="p-2.5 bg-amber-100/70 rounded-xl text-xs text-amber-950 border border-amber-300/40">
              Allergy requests are reviewed by the kitchen before the order is accepted. Cross-contact may still be possible in a shared commercial kitchen.
            </div>
            <button
              type="button"
              onClick={() => addAssistanceRequest(tableNumber, 'Allergy assistance')}
              className="text-xs font-bold text-amber-900 underline flex items-center gap-1"
            >
              <span>Speak to staff about an allergy</span>
            </button>
          </div>

          {/* 10. Jain & Vegan Options */}
          {(dish.jainAvailable || dish.veganAvailable) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-emerald-900">
              <h3 className="font-bold text-emerald-900 uppercase tracking-wider text-xs">Special Dietary Options</h3>
              {dish.jainAvailable && (
                <p>✓ <strong>Jain option available:</strong> Prepared without onion, garlic, and root vegetables upon request during customization.</p>
              )}
              {dish.veganAvailable && (
                <p>✓ <strong>Vegan option available:</strong> Butter, ghee, and dairy toppings can be replaced or excluded.</p>
              )}
            </div>
          )}

          {/* 11. Bestseller Reason */}
          {dish.bestseller && dish.bestsellerReason && (
            <div className="bg-amber-100/60 border border-amber-300 p-3.5 rounded-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <div>
                <span className="font-bold text-amber-900 text-xs uppercase block">Bestseller Badge</span>
                <p className="text-xs text-amber-900 font-medium">{dish.bestsellerReason}</p>
              </div>
            </div>
          )}

          {/* 12. Recommended Pairings */}
          {dish.recommendedPairings && dish.recommendedPairings.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-gray-900 text-base">Pairs well with</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dish.recommendedPairings.map((pairing) => (
                  <div
                    key={pairing.itemId || pairing.name}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {pairing.image && (
                        <img src={pairing.image} alt={pairing.name} className="w-12 h-12 object-cover rounded-lg" />
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{pairing.name}</h4>
                        <span className="text-xs text-amber-700 font-bold">{formatMenuPrice(pairing.price)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddPairing(pairing)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 13. Story of this Dish & Watch How It Is Made */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="w-full py-3 px-4 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Watch How It Is Made & Dish Story</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </article>
      </main>

      {/* Signature Dish Story & Video Modal */}
      {showStoryModal && (
        <SignatureDishStoryModal
          isOpen={showStoryModal}
          onClose={() => setShowStoryModal(false)}
          dish={dish}
        />
      )}

      {/* Trust Profile Modal */}
      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      {/* 14. Primary Action Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Total Price</span>
            <span className="text-xl font-bold text-amber-700">{formatMenuPrice(dish.price)}</span>
          </div>

          {dish.customizationAvailable ? (
            <button
              onClick={() => setIsCustomizationOpen(true)}
              disabled={!isAvailable}
              className="flex-1 py-3 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <span>Customize & Add</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDirectAddToCart}
              disabled={!isAvailable}
              className="flex-1 py-3 px-6 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </footer>

      {/* Customization Modal */}
      {isCustomizationOpen && (
        <CustomizationModal
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          dish={dish}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </>
  );
};

export default FoodDetailsScreen;
