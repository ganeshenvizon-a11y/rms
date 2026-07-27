import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { FoodTypeBadge, SpiceLevelBadge, PrepTimeBadge, AvailabilityBadge, PriceTag } from './DishBadges';
import { Sparkles, ChevronRight } from 'lucide-react';

/**
 * Two visual variants sharing one implementation:
 *  - 'compact'  — horizontal list row (menu browsing, search results)
 *  - 'featured' — vertical card with a larger image (Mangamma Favourites, New Here)
 */
const FoodCard = ({ dish, onCustomize, variant = 'compact' }) => {
  const navigate = useNavigate();
  const { addToCart, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();

  const quantityInCart = getDishQuantityInCart(dish.id);
  const isAvailable = dish.availabilityStatus === 'AVAILABLE' || dish.availabilityStatus === 'LIMITED_AVAILABILITY';
  const isSoldOut = dish.availabilityStatus === 'SOLD_OUT' || dish.availabilityStatus === 'TEMPORARILY_UNAVAILABLE';
  const isOrderable = dish.orderableInApp !== false;

  const handleCardClick = () => navigate(`/menu/${dish.id}`);

  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (!isAvailable || !isOrderable) return;

    if (dish.customizationAvailable && onCustomize) {
      onCustomize(dish);
    } else {
      addToCart(dish);
      showToast(`Added "${dish.name}" to cart`, 'success');
    }
  };

  const actionLabel = !isOrderable
    ? 'Ask your server'
    : !isAvailable
    ? (isSoldOut ? 'Sold Out' : 'Unavailable')
    : dish.customizationAvailable
    ? 'Customize & Add'
    : 'Add to Cart';

  const actionDisabled = !isAvailable || !isOrderable;

  if (variant === 'featured') {
    return (
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        className={`bg-surface-container-lowest rounded-2xl border border-border shadow-card hover:shadow-soft transition-shadow cursor-pointer overflow-hidden flex flex-col ${
          !isAvailable ? 'opacity-75' : ''
        }`}
      >
        <ResponsiveImage
          src={dish.image}
          alt={dish.name}
          aspectRatio="4 / 3"
          rounded="rounded-none"
          className="w-full"
          overlay={
            dish.bestseller && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-maroon-800/90 text-white text-[11px] font-bold">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Mangamma Favourite
              </span>
            )
          }
        />
        <div className="p-3.5 flex flex-col gap-2 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <FoodTypeBadge foodType={dish.foodType} />
            {dish.spiceLevel && <SpiceLevelBadge spiceLevel={dish.spiceLevel} />}
          </div>
          <div>
            <h3 className="font-bold text-ink text-[15px] leading-snug">{dish.name}</h3>
            <p className="text-muted text-xs line-clamp-2 mt-0.5">
              {dish.newCustomerReason || dish.shortDescription}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs mt-auto pt-1">
            <PrepTimeBadge minutes={dish.preparationTimeMinutes} />
            <AvailabilityBadge status={dish.availabilityStatus} />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
            <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-base" />
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={actionDisabled}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                actionDisabled
                  ? 'bg-surface-container-high text-muted cursor-not-allowed'
                  : 'bg-saffron-600 hover:bg-saffron-500 text-white active:scale-95'
              }`}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // compact (default) — horizontal row
  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`bg-surface-container-lowest rounded-2xl border border-border shadow-card hover:shadow-soft transition-shadow p-3.5 flex gap-3.5 relative cursor-pointer ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center flex-wrap gap-1.5 mb-1">
            <FoodTypeBadge foodType={dish.foodType} />
            {dish.spiceLevel && <SpiceLevelBadge spiceLevel={dish.spiceLevel} />}
            {dish.bestseller && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron-100 text-maroon-900 border border-saffron-600/30 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Favourite
              </span>
            )}
          </div>
          <h3 className="font-bold text-ink text-[15px] leading-snug">{dish.name}</h3>
          <p className="text-muted text-xs line-clamp-2 mt-0.5">{dish.shortDescription}</p>
        </div>

        <div className="flex items-center gap-3 pt-1.5">
          <PrepTimeBadge minutes={dish.preparationTimeMinutes} />
          <AvailabilityBadge status={dish.availabilityStatus} />
        </div>

        <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-border">
          <PriceTag price={dish.price} priceDisplay={dish.priceDisplay} className="text-base" />
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={actionDisabled}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              actionDisabled
                ? 'bg-surface-container-high text-muted cursor-not-allowed'
                : 'bg-saffron-600 hover:bg-saffron-500 text-white active:scale-95'
            }`}
          >
            <span>{actionLabel}</span>
            {isAvailable && isOrderable && dish.customizationAvailable && <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
            {isAvailable && isOrderable && !dish.customizationAvailable && quantityInCart > 0 && (
              <span className="bg-maroon-900/70 text-white px-1.5 py-0.5 rounded-full text-[10px] ml-0.5">{quantityInCart}</span>
            )}
          </button>
        </div>
      </div>

      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
        <ResponsiveImage src={dish.image} alt={dish.name} aspectRatio="1 / 1" className="w-full h-full" />
      </div>
    </div>
  );
};

export default FoodCard;
