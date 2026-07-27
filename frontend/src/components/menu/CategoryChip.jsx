import React from 'react';

const CategoryChip = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 ${
        isActive
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
      }`}
    >
      {category.name}
    </button>
  );
};

export default CategoryChip;
