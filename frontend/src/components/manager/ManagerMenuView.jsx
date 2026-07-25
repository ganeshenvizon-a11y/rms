import React, { useState } from 'react';
import { DISHES, CATEGORIES, RESTAURANT_INFO } from '../../utils/mockData';
import { addAuditLog } from '../../services/managerService';
import { useToast } from '../../context/ToastContext';
import * as LucideIcons from 'lucide-react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  X,
  Clock,
  LayoutGrid,
  BookOpen
} from 'lucide-react';

// Seed categories store a Lucide icon name (e.g. "Flame"); manager-created ones store an emoji.
const CategoryIcon = ({ icon, className = 'w-3.5 h-3.5 inline' }) => {
  const LucideIcon = icon && LucideIcons[icon];
  if (LucideIcon) return <LucideIcon className={className} />;
  return icon ? <span>{icon}</span> : null;
};

const DISHES_STORAGE_KEY = 'dakshin_menu_dishes';
const CATEGORIES_STORAGE_KEY = 'dakshin_menu_categories';

const DEFAULT_DISH_FORM = {
  name: '',
  italianName: '',
  category: 'dosas',
  price: '',
  prepTime: '15-20 min',
  description: '',
  ingredients: '',
  isVeg: true,
  isChefSpecial: false,
  image: '',
  inStock: true,
};

const DEFAULT_CATEGORY_FORM = { name: '', icon: '🍽️' };

const ManagerMenuView = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('items'); // 'items' | 'categories'

  const [dishes, setDishes] = useState(() => {
    const saved = localStorage.getItem(DISHES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DISHES;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : CATEGORIES.filter((c) => c.id !== 'all');
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'out_of_stock'

  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [dishForm, setDishForm] = useState(DEFAULT_DISH_FORM);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(DEFAULT_CATEGORY_FORM);

  const saveDishesToStorage = (updated) => {
    setDishes(updated);
    localStorage.setItem(DISHES_STORAGE_KEY, JSON.stringify(updated));
  };

  const saveCategoriesToStorage = (updated) => {
    setCategories(updated);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
  };

  // --- Dish CRUD ---
  const handleOpenAddDishModal = () => {
    setEditingDish(null);
    setDishForm({
      ...DEFAULT_DISH_FORM,
      category: categories[0]?.id || 'dosas',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDishModal = (dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name || '',
      italianName: dish.italianName || '',
      category: dish.category || categories[0]?.id || 'dosas',
      price: dish.price ? dish.price.toString() : '',
      prepTime: dish.prepTime || '15-20 min',
      description: dish.description || '',
      ingredients: dish.ingredients ? dish.ingredients.join(', ') : '',
      isVeg: dish.isVeg !== undefined ? dish.isVeg : true,
      isChefSpecial: dish.isChefSpecial || false,
      image: dish.image || '',
      inStock: dish.inStock !== undefined ? dish.inStock : true,
    });
    setIsDishModalOpen(true);
  };

  const handleToggleStock = (dishId) => {
    const updated = dishes.map((d) => {
      if (d.id === dishId) {
        const newStockState = d.inStock === undefined ? false : !d.inStock;
        addAuditLog('Stock Status Changed', `Toggled stock status of ${d.name} to ${newStockState ? 'In Stock' : 'Out of Stock'}`, 'menu');
        showToast(`${d.name} is now ${newStockState ? 'In Stock' : 'Out of Stock'}`, 'info');
        return { ...d, inStock: newStockState };
      }
      return d;
    });
    saveDishesToStorage(updated);
  };

  const handleDeleteDish = (dishId, dishName) => {
    if (window.confirm(`Are you sure you want to delete "${dishName}" from the menu?`)) {
      const updated = dishes.filter((d) => d.id !== dishId);
      saveDishesToStorage(updated);
      addAuditLog('Dish Removed', `Deleted menu item ${dishName}`, 'menu');
      showToast(`Removed "${dishName}" from menu`, 'error');
    }
  };

  const handleDishFormSubmit = (e) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price) {
      showToast('Please fill in dish name and price', 'error');
      return;
    }

    const priceNum = parseFloat(dishForm.price);
    const ingArray = dishForm.ingredients ? dishForm.ingredients.split(',').map((i) => i.trim()).filter(Boolean) : [];

    if (editingDish) {
      const updated = dishes.map((d) =>
        d.id === editingDish.id
          ? {
              ...d,
              name: dishForm.name,
              italianName: dishForm.italianName,
              category: dishForm.category,
              price: priceNum,
              prepTime: dishForm.prepTime,
              description: dishForm.description,
              ingredients: ingArray,
              isVeg: dishForm.isVeg,
              isChefSpecial: dishForm.isChefSpecial,
              image: dishForm.image || d.image,
              inStock: dishForm.inStock,
            }
          : d
      );
      saveDishesToStorage(updated);
      addAuditLog('Dish Updated', `Updated menu dish ${dishForm.name}`, 'menu');
      showToast(`Updated ${dishForm.name} successfully`, 'success');
    } else {
      const newDish = {
        id: `dish-${Date.now()}`,
        name: dishForm.name,
        italianName: dishForm.italianName || dishForm.name,
        category: dishForm.category,
        price: priceNum,
        prepTime: dishForm.prepTime,
        description: dishForm.description,
        ingredients: ingArray,
        isVeg: dishForm.isVeg,
        isChefSpecial: dishForm.isChefSpecial,
        rating: 5.0,
        calories: '600 kcal',
        image: dishForm.image || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
        inStock: dishForm.inStock,
        customizations: [],
      };
      saveDishesToStorage([newDish, ...dishes]);
      addAuditLog('New Dish Added', `Added new menu dish ${dishForm.name}`, 'menu');
      showToast(`Added ${dishForm.name} to menu`, 'success');
    }

    setIsDishModalOpen(false);
  };

  // --- Category CRUD ---
  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm(DEFAULT_CATEGORY_FORM);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, icon: cat.icon || '🍽️' });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (catId, catName) => {
    const itemCount = dishes.filter((d) => d.category === catId).length;
    if (itemCount > 0) {
      showToast(`Cannot delete "${catName}" — ${itemCount} dish(es) still assigned to it`, 'error');
      return;
    }
    if (window.confirm(`Delete category "${catName}"?`)) {
      saveCategoriesToStorage(categories.filter((c) => c.id !== catId));
      addAuditLog('Category Removed', `Deleted menu category ${catName}`, 'menu');
      showToast(`Removed category "${catName}"`, 'error');
    }
  };

  const handleCategoryFormSubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }

    if (editingCategory) {
      saveCategoriesToStorage(
        categories.map((c) => (c.id === editingCategory.id ? { ...c, name: categoryForm.name, icon: categoryForm.icon } : c))
      );
      addAuditLog('Category Updated', `Updated category ${categoryForm.name}`, 'menu');
      showToast(`Updated category "${categoryForm.name}"`, 'success');
    } else {
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        icon: categoryForm.icon || '🍽️',
      };
      saveCategoriesToStorage([...categories, newCategory]);
      addAuditLog('New Category Added', `Added new category ${categoryForm.name}`, 'menu');
      showToast(`Added category "${categoryForm.name}"`, 'success');
    }

    setIsCategoryModalOpen(false);
  };

  // Filtering Logic
  const filterableCategories = [{ id: 'all', name: 'All Items' }, ...categories];
  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      dish.name.toLowerCase().includes(query) ||
      (dish.description && dish.description.toLowerCase().includes(query))
    );
    const isInStock = dish.inStock !== false;
    const matchesStock = stockFilter === 'all' || (stockFilter === 'in_stock' ? isInStock : !isInStock);

    return matchesCategory && matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">

      {/* Header & Section Toggle */}
      <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Menu Management</h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure dishes, prices, categories, stock availability, and special tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-container p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSection('items')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${activeSection === 'items' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Menu Items
            </button>
            <button
              onClick={() => setActiveSection('categories')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${activeSection === 'categories' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Categories
            </button>
          </div>

          <button
            onClick={activeSection === 'items' ? handleOpenAddDishModal : handleOpenAddCategoryModal}
            className="px-4 py-2.5 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{activeSection === 'items' ? 'Add New Dish' : 'Add Category'}</span>
          </button>
        </div>
      </div>

      {activeSection === 'items' ? (
        <>
          {/* Filter & Search Bar */}
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Search by dish name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-transparent rounded-xl text-xs text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold w-full md:w-auto">
                <span className="text-on-surface-variant font-medium">Stock:</span>
                <button
                  onClick={() => setStockFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors ${stockFilter === 'all' ? 'bg-on-surface text-surface' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  All ({dishes.length})
                </button>
                <button
                  onClick={() => setStockFilter('in_stock')}
                  className={`px-3 py-1 rounded-lg transition-colors ${stockFilter === 'in_stock' ? 'bg-green-700 text-white' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  In Stock ({dishes.filter((d) => d.inStock !== false).length})
                </button>
                <button
                  onClick={() => setStockFilter('out_of_stock')}
                  className={`px-3 py-1 rounded-lg transition-colors ${stockFilter === 'out_of_stock' ? 'bg-error text-on-error' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  Out of Stock ({dishes.filter((d) => d.inStock === false).length})
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-outline-variant/40">
              {filterableCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-on-primary shadow-sm font-semibold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <CategoryIcon icon={cat.icon} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dishes Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => {
              const isInStock = dish.inStock !== false;
              return (
                <div
                  key={dish.id}
                  className={`bg-surface-container-lowest rounded-2xl border transition-all overflow-hidden shadow-sm flex flex-col justify-between ${
                    isInStock ? 'border-outline-variant hover:border-primary/40' : 'border-error/30'
                  }`}
                >
                  <div>
                    <div className="relative h-44 bg-surface-container overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${!isInStock ? 'grayscale opacity-75' : ''}`}
                      />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {dish.isVeg ? (
                          <span className="px-2 py-0.5 rounded-full bg-green-600/90 text-white text-[10px] font-bold">🌱 Veg</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-on-surface/80 text-white text-[10px] font-bold">🍖 Non-Veg</span>
                        )}
                        {dish.isChefSpecial && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold text-[10px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Chef's Special
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleStock(dish.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md border backdrop-blur-md flex items-center gap-1 transition-all ${
                            isInStock ? 'bg-green-600/90 text-white border-green-400' : 'bg-error/90 text-on-error border-error'
                          }`}
                          title="Click to toggle stock status"
                        >
                          {isInStock ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>IN STOCK</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>OUT OF STOCK</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-on-surface leading-snug">{dish.name}</h3>
                        <div className="text-base font-bold text-primary shrink-0">
                          ${typeof dish.price === 'number' ? dish.price.toFixed(2) : dish.price}
                        </div>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">{dish.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-outline-variant/40 mt-2 pt-3">
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dish.prepTime || '15 min'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditDishModal(dish)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.id, dish.name)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDishes.length === 0 && (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-outline-variant text-on-surface-variant space-y-2">
              <UtensilsCrossed className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
              <p className="font-semibold text-on-surface">No dishes match your filter criteria.</p>
              <p className="text-xs">Try adjusting your search query or category selection.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Categories Bento Grid */}
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-on-surface">Menu Architecture</h3>
              <p className="text-on-surface-variant text-sm mt-0.5">Organize your offerings into elegant categories.</p>
            </div>
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-semibold text-on-surface-variant">
              Total: {categories.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const itemsInCategory = dishes.filter((d) => d.category === cat.id);
              const thumbnail = itemsInCategory[0]?.image || RESTAURANT_INFO.heroImage;
              return (
                <div
                  key={cat.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant hover:-translate-y-1 transition-all group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={thumbnail} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full text-[10px] font-bold text-primary flex items-center gap-1 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                        <CategoryIcon icon={cat.icon} className="w-4 h-4" />
                        <span>{cat.name}</span>
                      </h4>
                    </div>
                    <p className="text-xs text-on-surface-variant opacity-70 mb-3">{itemsInCategory.length} item(s) in category</p>
                    <div className="flex items-center justify-end gap-1 border-t border-outline-variant/40 pt-2.5">
                      <button
                        onClick={() => handleOpenEditCategoryModal(cat)}
                        className="p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg hover:bg-error-container/30 transition-colors text-error"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleOpenAddCategoryModal}
              className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-6 group hover:bg-surface-container hover:border-primary/50 transition-all min-h-[240px]"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-all">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-on-surface-variant">Create New Category</h4>
              <p className="text-xs text-on-surface-variant/60 text-center mt-1 px-4">Define a new section for your menu</p>
            </button>
          </div>
        </>
      )}

      {/* Add / Edit Dish Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant relative my-8">
            <button onClick={() => setIsDishModalOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-on-surface mb-1">{editingDish ? `Edit "${editingDish.name}"` : 'Add New Dish'}</h3>
            <p className="text-xs text-on-surface-variant mb-4">Enter dish details, pricing, ingredients and tags.</p>

            <form onSubmit={handleDishFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    placeholder="e.g. Ghee Roast Masala Dosa"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Category *</label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                    placeholder="12.50"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={dishForm.prepTime}
                    onChange={(e) => setDishForm({ ...dishForm, prepTime: e.target.value })}
                    placeholder="15-20 min"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Description</label>
                <textarea
                  rows={2}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  placeholder="Describe the dish preparation and highlights..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={dishForm.ingredients}
                  onChange={(e) => setDishForm({ ...dishForm, ingredients: e.target.value })}
                  placeholder="Rice batter, ghee, potato masala..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Image URL</label>
                <input
                  type="url"
                  value={dishForm.image}
                  onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={dishForm.isVeg} onChange={(e) => setDishForm({ ...dishForm, isVeg: e.target.checked })} className="w-4 h-4 accent-primary rounded" />
                  <span className="font-semibold text-on-surface">Vegetarian Dish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={dishForm.isChefSpecial} onChange={(e) => setDishForm({ ...dishForm, isChefSpecial: e.target.checked })} className="w-4 h-4 accent-primary rounded" />
                  <span className="font-semibold text-on-surface">Chef's Special Tag</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={dishForm.inStock} onChange={(e) => setDishForm({ ...dishForm, inStock: e.target.checked })} className="w-4 h-4 accent-green-600 rounded" />
                  <span className="font-semibold text-on-surface">Available In Stock</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
                <button type="button" onClick={() => setIsDishModalOpen(false)} className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold shadow-md transition-colors">
                  {editingDish ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant relative">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-on-surface mb-4">{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>

            <form onSubmit={handleCategoryFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  maxLength={2}
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-16 p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface text-center text-lg focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Tandoori Specials"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/40">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold shadow-md transition-colors">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerMenuView;
