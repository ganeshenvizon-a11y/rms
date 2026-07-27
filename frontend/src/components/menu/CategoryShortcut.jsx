import React from 'react';
import { getCategoryIcon } from './CategoryIcons';

/**
 * Visual category shortcut tile.
 * Renders a crisp SVG illustration and short label in a compact touch card.
 */
const CategoryShortcut = ({ category, isActive, onClick }) => {
  const IconComponent = getCategoryIcon(category.id);

  // Shorten names visually if needed (e.g. "Main Course – Veg" -> "Veg Curries")
  const getShortLabel = (cat) => {
    switch (cat.id) {
      case 'all':
        return 'Full Menu';
      case 'meals':
        return 'Meals';
      case 'biryanis':
        return 'Biryanis';
      case 'veg_soups':
        return 'Veg Soups';
      case 'nonveg_soups':
        return 'Non-Veg Soups';
      case 'nonveg_starters':
        return 'Starters';
      case 'chinese_veg_starters':
        return 'Veg Starters';
      case 'fish_prawns':
        return 'Seafood';
      case 'tandoor':
        return 'Tandoor';
      case 'main_course_veg':
        return 'Veg Curries';
      case 'main_course_nonveg':
        return 'Non-Veg';
      case 'rotis_breads':
        return 'Breads';
      case 'veg_pulaos':
        return 'Pulaos';
      case 'rice_varieties':
        return 'Rice';
      case 'fried_rice_noodles':
        return 'Noodles & Rice';
      case 'desserts':
        return 'Desserts';
      case 'drinks':
        return 'Drinks';
      default:
        return cat.name;
    }
  };

  const label = getShortLabel(category);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`Show ${category.name} category`}
      className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A30F3B] focus-visible:ring-offset-2 rounded-2xl transition-transform active:scale-95"
      style={{ width: '74px', scrollSnapAlign: 'start' }}
    >
      {/* Icon tile container (68-74px) */}
      <div
        className={`w-[68px] h-[68px] rounded-[20px] flex items-center justify-center transition-all duration-200 shadow-2xs ${
          isActive
            ? 'bg-[#FBECEF] border-2 border-[#A30F3B] shadow-sm scale-105'
            : 'bg-[#FFF7EE] border border-[#EADFD6] hover:bg-[#FFF0E3] hover:border-[#F47712]/40'
        }`}
      >
        <IconComponent className={`w-8 h-8 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
      </div>

      {/* Label */}
      <span
        className={`text-[11.5px] text-center leading-tight tracking-tight px-0.5 line-clamp-1 transition-colors ${
          isActive ? 'font-bold text-[#A30F3B]' : 'font-semibold text-[#6F5F58] group-hover:text-[#211917]'
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default CategoryShortcut;
