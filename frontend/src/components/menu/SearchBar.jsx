import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear, placeholder = 'Search dishes, curries or biryanis' }) => {
  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-3.5 w-5 h-5 text-[#95867E] pointer-events-none" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search dishes, curries or biryanis"
        className="w-full h-[48px] pl-11 pr-10 rounded-[14px] bg-white border border-[#EADFD6] focus:ring-2 focus:ring-[#A30F3B] focus:border-[#A30F3B] placeholder:text-[#95867E] text-[14px] text-[#211917] transition-all outline-none shadow-2xs"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search text"
          className="absolute right-3 flex items-center justify-center w-7 h-7 rounded-full text-[#95867E] hover:text-[#211917] hover:bg-[#FFF7EE] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
