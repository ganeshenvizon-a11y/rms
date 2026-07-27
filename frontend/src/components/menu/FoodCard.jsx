import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatMenuPrice } from '../../utils/formatters';
import { Sparkles, Info, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

const FoodCard = ({ dish, onCustomize }) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();
  const [showBestsellerTooltip, setShowBestsellerTooltip] = useState(false);

  const quantityInCart = getDishQuantityInCart(dish.id);

  // Status checks
  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isLimited = dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isSoldOut = dish.availabilityStatus === 'SOLD_OUT';
  const isTempUnavailable = dish.availabilityStatus === 'TEMPORARILY_UNAVAILABLE';

  // Food type label mapping
  const getFoodTypeBadge = () => {
    switch (dish.foodType) {
      case 'VEGAN':
        return { label: 'Vegan', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', symbol: '🌱' };
      case 'CONTAINS_EGG':
        return { label: 'Contains Egg', color: 'bg-amber-100 text-amber-900 border-amber-300', symbol: '🥚' };
      case 'NON_VEGETARIAN':
        return { label: 'Non-Vegetarian', color: 'bg-rose-100 text-rose-900 border-rose-300', symbol: '🍗' };
      case 'VEGETARIAN':
      default:
        return { label: 'Vegetarian', color: 'bg-green-100 text-green-800 border-green-300', symbol: '🟢' };
    }
  };

  const foodBadge = getFoodTypeBadge();

  // Spice level label mapping
  const getSpiceLabel = () => {
    switch (dish.spiceLevel) {
      case 'MILD':
        return 'Mild Spice';
      case 'SPICY':
        return 'Spicy';
      case 'EXTRA_SPICY':
        return 'Extra Spicy';
      case 'MEDIUM':
      default:
        return 'Medium Spice';
    }
  };

  const handleCardClick = () => {
    navigate(`/menu/${dish.id}`);
  };

  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;

    if (dish.customizationAvailable && onCustomize) {
      onCustomize(dish);
    } else {
      addToCart(dish);
      showToast(`Added "${dish.name}" to cart`, 'success');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col sm:flex-row gap-4 relative overflow-hidden cursor-pointer ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Left Column: Information Hierarchy */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Badge Bar */}
          <div className="flex items-center flex-wrap gap-1.5 mb-1.5 text-[11px]">
            {/* Food Type Indicator */}
            <span className={`px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${foodBadge.color}`}>
              <span>{foodBadge.symbol}</span>
              <span>{foodBadge.label}</span>
            </span>

            {/* Spice Indicator */}
            {dish.spiceLevel && (
              <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-medium flex items-center gap-1" title={`Spice Level: ${getSpiceLabel()}`}>
                <span>🌶</span>
                <span>{getSpiceLabel()}</span>
              </span>
            )}

            {/* Bestseller Badge with Tooltip */}
            {dish.bestseller && (
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBestsellerTooltip(!showBestsellerTooltip);
                  }}
                  className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold flex items-center gap-1 hover:bg-amber-200"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Bestseller</span>
                  <Info className="w-3 h-3 text-amber-700 ml-0.5" />
                </button>

                {showBestsellerTooltip && dish.bestsellerReason && (
                  <div className="absolute left-0 top-full mt-1 z-20 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl">
                    {dish.bestsellerReason}
                  </div>
                )}
              </div>
            )}

            {/* Signature Dish Story Badge */}
            {(dish.id === 'dish-001' || dish.id === 'dish-002' || dish.id === 'dish-004' || dish.id === 'dish-007') && (
              <span className="px-2 py-0.5 rounded-full bg-secondary-container/50 text-on-secondary-container border border-secondary/30 font-bold text-[10px] flex items-center gap-1">
                <span>🎬</span>
                <span>Dish Story</span>
              </span>
            )}

            {/* Jain Option Badge */}
            {dish.jainAvailable && dish.foodType !== 'VEGAN' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                Jain option available
              </span>
            )}

            {/* Vegan Option Badge */}
            {dish.veganAvailable && dish.foodType !== 'VEGAN' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                Vegan option available
              </span>
            )}
          </div>

          {/* Title & Short Description */}
          <h3 className="font-bold text-gray-900 text-base leading-snug">{dish.name}</h3>
          <p className="text-gray-600 text-xs line-clamp-2 mt-0.5">{dish.shortDescription || dish.description}</p>
        </div>

        {/* Practical Metadata Bar */}
        <div className="space-y-1 text-xs text-gray-500 pt-1">
          {/* Prep time or availability */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {isAvailable ? (
              <span>Ready in approx {dish.preparationTimeMinutes || 15} mins</span>
            ) : (
              <span className="text-red-600 font-medium">Currently unavailable</span>
            )}
          </div>

          {/* Allergen Compact Warning */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="text-[11px] text-amber-800 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
              <span>Contains: {dish.allergens.join(', ')}</span>
            </div>
          )}

          {/* Limited Availability Banner */}
          {isLimited && (
            <div className="text-[11px] font-semibold text-amber-700">
              ⚡ Only a few portions left
            </div>
          )}

          {/* Unavailable state explanations */}
          {isSoldOut && (
            <div className="text-[11px] font-semibold text-red-600">
              Sold out for today
            </div>
          )}
          {isTempUnavailable && (
            <div className="text-[11px] font-semibold text-red-600">
              Temporarily unavailable
            </div>
          )}
        </div>

        {/* Price & Primary Action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="font-bold text-amber-700 text-lg">{formatMenuPrice(dish.price)}</span>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={!isAvailable}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 ${
              !isAvailable
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : dish.customizationAvailable
                ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
            }`}
          >
            {!isAvailable ? (
              isSoldOut ? 'Sold Out' : 'Unavailable'
            ) : dish.customizationAvailable ? (
              <>
                <span>Customize & Add</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Add to Cart</span>
                {quantityInCart > 0 && <span className="bg-amber-800 text-white px-1.5 py-0.2 rounded-full text-[10px] ml-1">{quantityInCart}</span>}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Dish Thumbnail */}
      <div className="w-full sm:w-36 h-36 sm:h-auto relative flex-shrink-0">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover rounded-xl border border-gray-100"
          loading="lazy"
        />
        {dish.portionLabel && (
          <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {dish.portionLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
