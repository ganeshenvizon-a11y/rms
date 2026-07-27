import React from 'react';
import { Info } from 'lucide-react';

const CATEGORY_DESCRIPTIONS = {
  all: 'Explore our complete authentic menu prepared fresh for your table',
  meals: 'Traditional banana-leaf meals and complete regional combinations',
  biryanis: 'Slow dum-cooked fragrant basmati rice layered with delicate spices',
  veg_soups: 'Warm, appetizing vegetable and corn broth infusions',
  nonveg_soups: 'Rich, comforting chicken and house special soups',
  nonveg_starters: 'Crispy fried and spiced chicken and meat appetizers',
  chinese_veg_starters: 'Crisp Indo-Chinese vegetable Manchurian and paneer starters',
  fish_prawns: 'Fresh coastal fish and prawns cooked with regional masalas',
  tandoor: 'Clay tandoor roasted kebabs and marinated delicacies',
  main_course_veg: 'Rich vegetarian curries, paneer dishes and classic lentils',
  main_course_nonveg: 'Home-style regional chicken, mutton and egg curries',
  rotis_breads: 'Freshly baked tandoori rotis, naan, parathas and pulkas',
  veg_pulaos: 'Lightly spiced basmati rice cooked with fresh vegetables & paneer',
  rice_varieties: 'Regional rice preparations, sambar rice, and curd rice',
  fried_rice_noodles: 'Wok-tossed Indo-Chinese fried rice and soft noodles',
  desserts: 'Traditional sweet gulab jamuns and slow-cooked carrot halwa',
  drinks: 'Refreshing lime mint coolers, sweet lassi and churned buttermilk',
};

const MenuSectionHeader = ({ selectedCategoryObj, dishCount = 0, onOpenTrustProfile }) => {
  const catId = selectedCategoryObj?.id || 'all';
  const title = selectedCategoryObj?.name || 'Full Menu';
  const description = CATEGORY_DESCRIPTIONS[catId] || 'Freshly prepared authentic regional dishes';

  return (
    <div className="px-4 mt-7 mb-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[21px] sm:text-[23px] font-bold text-[#211917] tracking-tight leading-tight">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {onOpenTrustProfile && (
            <button
              type="button"
              onClick={onOpenTrustProfile}
              className="text-xs font-semibold text-[#A30F3B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Kitchen</span>
            </button>
          )}
          <span className="text-[12px] text-[#6F5F58] font-bold bg-[#FFF7EE] border border-[#EADFD6] px-3 py-1 rounded-full shrink-0">
            {dishCount} {dishCount === 1 ? 'Dish' : 'Dishes'}
          </span>
        </div>
      </div>
      <p className="text-[13px] text-[#6F5F58] mt-1.5 leading-relaxed">{description}</p>
    </div>
  );
};

export default MenuSectionHeader;
