import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import Icon from '../common/Icon';

const FoodCard = ({ dish }) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getDishQuantityInCart } = useCart();
  const { showToast } = useToast();

  const quantityInCart = getDishQuantityInCart(dish.id);

  const handleCardClick = () => navigate(`/menu/${dish.id}`);

  const handleAddDirectly = (e) => {
    e.stopPropagation();
    addToCart(dish);
    showToast(`Added "${dish.name}" to cart`, 'success');
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    addToCart(dish);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(dish.id, quantityInCart - 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-surface-container-lowest rounded-card shadow-sm p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Left: Content */}
      <div className="w-[62%] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-3 h-3 border flex items-center justify-center p-[2px] ${
                dish.isVeg ? 'border-green-600' : 'border-red-600'
              }`}
            >
              <span className={`w-full h-full rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
            </span>
            <span className={`text-[10px] uppercase tracking-wider font-bold ${dish.isVeg ? 'text-green-700' : 'text-red-700'}`}>
              {dish.isVeg ? 'Veg' : 'Non-Veg'}
            </span>
            {dish.isChefSpecial && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-on-secondary-container bg-secondary-container/70 px-1.5 py-0.5 rounded-full">
                Chef's Pick
              </span>
            )}
          </div>
          <h3 className="font-bold text-on-surface text-base mb-1 leading-tight">{dish.name}</h3>
          <p className="text-on-surface-variant text-xs line-clamp-2 mb-2">{dish.description}</p>
        </div>
        <div>
          <div className="flex items-center text-on-surface-variant/70 gap-1 mb-2">
            <Icon name="schedule" className="text-[16px]" />
            <span className="text-xs">{dish.prepTime}</span>
          </div>
          <span className="font-bold text-primary text-lg">{formatCurrency(dish.price)}</span>
        </div>
      </div>

      {/* Right: Image + Quantity Control */}
      <div className="w-[38%] relative">
        <img className="w-full h-32 object-cover rounded-xl" src={dish.image} alt={dish.name} loading="lazy" />

        {quantityInCart > 0 ? (
          <div className="absolute -bottom-2 -right-2 flex items-center bg-primary text-on-primary rounded-full px-1 shadow-lg">
            <button onClick={handleDecrement} className="w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">
              <Icon name="remove" className="text-sm" />
            </button>
            <span className="px-1 font-bold text-sm">{quantityInCart}</span>
            <button onClick={handleIncrement} className="w-8 h-8 flex items-center justify-center active:scale-90 transition-transform">
              <Icon name="add" className="text-sm" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddDirectly}
            className="absolute -bottom-2 -right-2 w-[42px] h-[42px] bg-primary text-on-primary rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-all"
          >
            <Icon name="add" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
