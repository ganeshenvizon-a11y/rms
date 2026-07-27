import React from 'react';
import Icon from '../common/Icon';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search dishes, curries, biryanis…' }) => {
  return (
    <div className="relative flex items-center">
      <Icon name="search" className="absolute left-4 text-on-surface-variant" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 pl-12 pr-10 rounded-xl bg-surface-container border-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/60 text-sm transition-all outline-none"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <Icon name="close" className="text-lg" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
