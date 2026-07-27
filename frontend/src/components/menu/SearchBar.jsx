import React from 'react';
import Icon from '../common/Icon';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search dishes, curries or biryanis' }) => {
  return (
    <div className="relative flex items-center">
      <Icon name="search" className="absolute left-3.5 text-on-surface-variant text-[19px]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search dishes"
        className="w-full h-12 pl-11 pr-10 rounded-[14px] bg-surface-container-lowest border border-border focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant/60 text-sm transition-all outline-none"
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 flex items-center justify-center w-7 h-7 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Icon name="close" className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
