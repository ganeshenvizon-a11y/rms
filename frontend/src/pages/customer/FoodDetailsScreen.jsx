import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { formatMenuPrice } from '../../utils/formatters';
import ResponsiveImage from '../../components/common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PrepTimeBadge, AvailabilityBadge, PriceTag } from '../../components/menu/DishBadges';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import CustomizationModal from '../../components/menu/CustomizationModal';
import RestaurantTrustProfileModal from '../../components/trust/RestaurantTrustProfileModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import { Sparkles, ChevronRight, Plus, BookOpen, ShieldAlert, AlertTriangle, ArrowLeft, Heart } from 'lucide-react';

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
  const [isFavourite, setIsFavourite] = useState(false);

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
  const isOrderable = dish.orderableInApp !== false;
  const prepTimeMin = dish.preparationTimeMinutes || 15;
  const isDelayedDish = prepTimeMin >= 30 || kitchenLoad?.status === 'BUSY' || kitchenLoad?.status === 'VERY_BUSY';

  const handleAddToCartFromModal = (payload) => {
    const { dish: d, quantity, formattedModifiers, allergyAlert, specialInstruction, selectedOptions, makeVegan, jainPreparation } = payload;
    addToCart(d, formattedModifiers, specialInstruction, quantity, { selectedOptions, makeVegan, jainPreparation, allergyAlert });
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
      <main className="flex-1 pb-40 max-w-3xl mx-auto w-full">
        {/* 1. Image with 2. Back and 3. Favourite actions */}
        <section className="relative w-full h-[42vh] sm:h-[46vh]">
          <ResponsiveImage
            src={dish.image}
            alt={dish.name}
            aspectRatio={undefined}
            rounded="rounded-none"
            fetchPriority="high"
            className="w-full h-full"
            overlay={<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />}
          />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
            <button
              onClick={() => setIsFavourite((v) => !v)}
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              aria-pressed={isFavourite}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white active:scale-95 transition-all shadow-sm"
            >
              <Heart className={`w-5 h-5 ${isFavourite ? 'fill-danger text-danger' : 'text-ink'}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end z-10">
            {/* 4. Dish name */}
            <div>
              <span className="text-xs bg-saffron-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {dish.portionLabel || 'Regular'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black mt-1 leading-tight">{dish.name}</h1>
            </div>
            {/* 5. Price */}
            <div className="text-2xl sm:text-3xl font-black text-saffron-100">
              {dish.priceDisplay || formatMenuPrice(dish.price)}
            </div>
          </div>
        </section>

        <article className="px-4 py-6 space-y-6 text-sm">
          {/* 6. Dietary and spice indicators */}
          <div className="flex flex-wrap items-center gap-2">
            <FoodTypeBadge foodType={dish.foodType} />
            <SpiceLevelBadge spiceLevel={dish.spiceLevel} />
            {/* 7. Preparation estimate */}
            <PrepTimeBadge minutes={prepTimeMin} className="px-3 py-1 rounded-full bg-surface-container border border-border" />
          </div>

          {isDelayedDish && (
            <div className="p-4 rounded-2xl bg-warning/10 border border-warning/30 text-ink space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-warning">
                <AlertTriangle className="w-4 h-4" />
                <span>Longer preparation time</span>
              </div>
              <p className="text-xs leading-relaxed text-text">
                This item currently takes approximately <strong>{prepTimeMin}–{prepTimeMin + 5} minutes</strong> due to kitchen volume. Other items in your order may be ready earlier.
              </p>
            </div>
          )}

          {/* 8. Short practical description */}
          <div className="bg-cream p-4 rounded-2xl border border-border">
            <p className="text-text text-base font-medium leading-relaxed">{dish.shortDescription || dish.description}</p>
          </div>

          {/* 9. Portion and serving information */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-border text-xs">
            <span className="font-semibold text-on-surface-variant">Portion</span>
            <span className="font-bold text-ink">{dish.portionLabel || 'Regular'} · Serves {dish.serves || '1 person'}</span>
          </div>

          {/* 10. Allergens */}
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink flex items-center gap-2 text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-warning" /> Allergens & Allergy Policy
              </h3>
              <button type="button" onClick={() => setIsTrustOpen(true)} className="text-[11px] font-bold text-maroon-800 underline">
                Read Kitchen Policy
              </button>
            </div>
            <p className="text-xs text-text"><strong>Gluten Status:</strong> {dish.glutenStatus || 'Gluten status unavailable'}</p>
            <p className="text-xs text-text"><strong>Allergens Present:</strong> {dish.allergens?.length > 0 ? dish.allergens.join(', ') : 'None listed'}</p>
            <div className="p-2.5 bg-surface-container-lowest rounded-xl text-xs text-text border border-border">
              Allergy requests are reviewed by the kitchen before the order is accepted. Cross-contact may still be possible in a shared commercial kitchen.
            </div>
            <button
              type="button"
              onClick={() => addAssistanceRequest(tableNumber, 'Allergy assistance')}
              className="text-xs font-bold text-maroon-800 underline flex items-center gap-1"
            >
              <span>Speak to staff about an allergy</span>
            </button>
          </div>

          {/* 11. Availability */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-border">
            <span className="font-semibold text-on-surface-variant text-xs">Availability</span>
            <span className={`font-bold text-xs ${isAvailable ? 'text-success' : 'text-danger'}`}>
              {dish.availabilityStatus === 'AVAILABLE'
                ? 'Available Now'
                : dish.availabilityStatus === 'LIMITED_AVAILABILITY'
                ? 'Limited Availability (Few portions left)'
                : dish.availabilityStatus === 'SOLD_OUT'
                ? 'Sold Out Today'
                : 'Temporarily Unavailable'}
            </span>
          </div>

          {!isOrderable && (
            <div className="p-3 rounded-xl bg-information/10 border border-information/30 text-xs text-ink">
              This item is priced at MRP and isn't orderable through the app — please ask your server.
            </div>
          )}

          {/* 12. Customization: dietary options preview (actual customization happens via the sticky footer) */}
          {(dish.jainAvailable || dish.veganAvailable) && (
            <div className="bg-success/10 border border-success/30 rounded-2xl p-4 space-y-2 text-xs text-text">
              <h3 className="font-bold text-success uppercase tracking-wider text-xs">Special Dietary Options</h3>
              {dish.jainAvailable && <p>✓ <strong>Jain option available:</strong> Prepared without onion, garlic, and root vegetables upon request during customization.</p>}
              {dish.veganAvailable && <p>✓ <strong>Vegan option available:</strong> Butter, ghee, and dairy toppings can be replaced or excluded.</p>}
            </div>
          )}

          {dish.bestseller && dish.bestsellerReason && (
            <div className="bg-saffron-100 border border-saffron-600/30 p-3.5 rounded-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-maroon-800 flex-shrink-0" />
              <div>
                <span className="font-bold text-maroon-900 text-xs uppercase block">Mangamma Favourite</span>
                <p className="text-xs text-maroon-900 font-medium">{dish.bestsellerReason}</p>
              </div>
            </div>
          )}

          {/* 13. Recommended pairings */}
          {dish.recommendedPairings && dish.recommendedPairings.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-ink text-base">Pairs well with</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dish.recommendedPairings.map((pairing) => (
                  <div key={pairing.itemId || pairing.name} className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center gap-3">
                      {pairing.image && <img src={pairing.image} alt={pairing.name} className="w-12 h-12 object-cover rounded-lg" />}
                      <div>
                        <h4 className="font-bold text-xs text-ink">{pairing.name}</h4>
                        <span className="text-xs text-maroon-800 font-bold">{formatMenuPrice(pairing.price)}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleAddPairing(pairing)} className="px-3 py-1.5 rounded-lg bg-saffron-100 hover:bg-saffron-100/70 text-maroon-900 font-bold text-xs flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. Secondary "Story of this dish" */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="w-full py-3 px-4 rounded-xl border border-border bg-cream hover:bg-sand text-maroon-900 font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-maroon-800" />
                <span>Story of this dish</span>
              </div>
              <ChevronRight className="w-4 h-4 text-maroon-800" />
            </button>
          </div>
        </article>
      </main>

      {showStoryModal && <SignatureDishStoryModal isOpen={showStoryModal} onClose={() => setShowStoryModal(false)} dish={dish} />}

      <RestaurantTrustProfileModal
        isOpen={isTrustOpen}
        onClose={() => setIsTrustOpen(false)}
        onRequestAssistance={(type) => addAssistanceRequest(tableNumber, type)}
      />

      {/* 15. Sticky "Customize & Add" footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-border px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Total Price</span>
            <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-xl" />
          </div>

          {!isOrderable ? (
            <button disabled className="flex-1 py-3 px-6 bg-surface-container-high text-muted font-bold rounded-xl text-sm cursor-not-allowed">
              Ask Your Server
            </button>
          ) : dish.customizationAvailable ? (
            <button
              onClick={() => setIsCustomizationOpen(true)}
              disabled={!isAvailable}
              className="flex-1 py-3 px-6 bg-saffron-600 hover:bg-saffron-500 disabled:bg-surface-container-high disabled:text-muted text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <span>Customize & Add</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleDirectAddToCart}
              disabled={!isAvailable}
              className="flex-1 py-3 px-6 bg-saffron-600 hover:bg-saffron-500 disabled:bg-surface-container-high disabled:text-muted text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </footer>

      {isCustomizationOpen && (
        <CustomizationModal isOpen={isCustomizationOpen} onClose={() => setIsCustomizationOpen(false)} dish={dish} onAddToCart={handleAddToCartFromModal} />
      )}
    </>
  );
};

export default FoodDetailsScreen;
