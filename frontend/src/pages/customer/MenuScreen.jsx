import React, { useState, useEffect } from 'react';
import { menuService } from '../../services/menuService';
import TopAppBar from '../../components/layout/TopAppBar';
import BottomNavBar from '../../components/layout/BottomNavBar';
import CategoryChip from '../../components/menu/CategoryChip';
import SearchBar from '../../components/menu/SearchBar';
import FoodCard from '../../components/menu/FoodCard';
import StickyCartBar from '../../components/menu/StickyCartBar';
import { MenuSkeletonList, CategorySkeletonRow } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Icon from '../../components/common/Icon';

const MenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <TopAppBar variant="brand" />

      <main className="flex-1 pb-40 pt-20 px-4 max-w-screen-xl mx-auto w-full">
        {/* Search Bar */}
        <section className="mt-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} onClear={() => setSearchQuery('')} />
        </section>

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

        {/* Results Count */}
        <div className="flex items-center justify-between pt-2 pb-2">
          <h2 className="text-lg font-bold text-on-surface">
            {categories.find((c) => c.id === selectedCategory)?.name || 'Full Menu'}
          </h2>
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
              <FoodCard key={dish.id} dish={dish} />
            ))}
          </section>
        )}
      </main>

      <StickyCartBar />
      <BottomNavBar />
    </>
  );
};

export default MenuScreen;
