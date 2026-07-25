import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { menuService } from '../../services/menuService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import TopAppBar from '../../components/layout/TopAppBar';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Icon from '../../components/common/Icon';

const FoodDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [dish, setDish] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadDish = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await menuService.getDishById(id);
        setDish(res.data);
        setQuantity(1);
        setSelectedOptions([]);
        setSpecialInstruction('');
      } catch (err) {
        setError('Dish details could not be found.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDish();
  }, [id]);

  const calculatedUnitPrice = useMemo(() => {
    if (!dish) return 0;
    const optionsExtra = selectedOptions.reduce((acc, opt) => acc + (opt.price || 0), 0);
    return dish.price + optionsExtra;
  }, [dish, selectedOptions]);

  const totalCalculatedPrice = calculatedUnitPrice * quantity;

  // Flatten all customization groups into a single row of toggle chips, matching the reference design
  const flatOptions = useMemo(() => {
    if (!dish?.customizations) return [];
    return dish.customizations.flatMap((group) =>
      group.options.map((option) => ({ ...option, groupName: group.name }))
    );
  }, [dish]);

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((opt) => opt.name === option.name);
      if (exists) return prev.filter((opt) => opt.name !== option.name);
      return [...prev, { groupName: option.groupName, name: option.name, price: option.price }];
    });
  };

  const handleAddToCart = () => {
    if (!dish) return;
    addToCart(dish, selectedOptions, specialInstruction, quantity);
    showToast(`Added ${quantity}x "${dish.name}" to cart`, 'success');
    navigate('/menu');
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error || !dish) return <ErrorState message={error} onRetry={() => navigate('/menu')} />;

  return (
    <>
      <TopAppBar
        variant="back"
        transparent
        rightIcon={isFavorite ? 'favorite' : 'favorite_border'}
        onRightAction={() => setIsFavorite((f) => !f)}
      />

      <main className="flex-1 pb-40">
        {/* Hero Section */}
        <section className="relative w-full h-[40vh] overflow-hidden">
          <img src={dish.image} alt={dish.name} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="absolute top-20 left-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full border border-white ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${dish.isVeg ? 'text-green-800' : 'text-red-800'}`}>
                {dish.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="bg-secondary-container/95 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Icon name="star" className="text-sm" filled />
              <span className="text-xs font-bold text-on-secondary-container">{dish.rating || 4.8}</span>
            </div>
          </div>
        </section>

        {/* Dish Info */}
        <article className="px-4 pt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">{dish.name}</h1>
            </div>
            {dish.italianName && (
              <p className="text-sm italic text-on-surface-variant -mt-1">{dish.italianName}</p>
            )}
            <div className="text-2xl font-bold text-primary">{formatCurrency(dish.price)}</div>
            <p className="text-on-surface-variant text-sm leading-relaxed">{dish.description}</p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <Icon name="schedule" className="text-lg" />
                <span className="text-sm font-medium">{dish.prepTime}</span>
              </div>
              {dish.calories && (
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <Icon name="local_fire_department" className="text-lg" />
                  <span className="text-sm font-medium">{dish.calories}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          {dish.ingredients?.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">Key Ingredients</h2>
              <div className="flex flex-wrap gap-1.5">
                {dish.ingredients.map((ing) => (
                  <span key={ing} className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-xs font-medium rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Customizations */}
          {flatOptions.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-on-surface">Customize Your Order</h2>
              <div className="flex flex-wrap gap-2">
                {flatOptions.map((option) => {
                  const isChecked = selectedOptions.some((opt) => opt.name === option.name);
                  return (
                    <button
                      key={option.name}
                      onClick={() => handleOptionToggle(option)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95 ${
                        isChecked
                          ? 'bg-primary border-primary text-on-primary'
                          : 'border-outline-variant bg-surface text-on-surface'
                      }`}
                    >
                      {option.name}
                      {option.price > 0 && ` (+${formatCurrency(option.price)})`}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Special Instructions */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-on-surface">Special Instructions</h2>
            <textarea
              rows={3}
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              placeholder="Add cooking instructions..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-sm placeholder:text-on-surface-variant/50 resize-none"
            />
          </section>

          {/* Quantity Selector */}
          <div className="flex justify-center pt-2">
            <div className="flex items-center gap-8 bg-surface-container-low px-2 py-2 rounded-full shadow-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest shadow-sm hover:text-primary transition-colors active:scale-90"
              >
                <Icon name="remove" className="text-xl" />
              </button>
              <span className="font-bold text-xl min-w-[1.5ch] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:opacity-90 transition-all active:scale-90"
              >
                <Icon name="add" className="text-xl" />
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-xl px-4 py-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Total</span>
            <span className="text-2xl font-black text-on-surface">{formatCurrency(totalCalculatedPrice)}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 h-14 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-95 shadow-md"
          >
            <span>Add to Cart</span>
            <Icon name="shopping_basket" className="text-lg" />
          </button>
        </div>
      </footer>
    </>
  );
};

export default FoodDetailsScreen;
