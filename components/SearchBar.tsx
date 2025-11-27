'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useVideoStore } from '@/lib/store';

interface SearchBarProps {
  onFocusChange?: (focused: boolean) => void;
}

export default function SearchBar({ onFocusChange }: SearchBarProps) {
  const { setSearchQuery } = useVideoStore();
  const [localSearch, setLocalSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const handleClear = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  return (
    <div className={`relative max-w-2xl flex-1 min-w-0 transition-all duration-300 ${isFocused && isMobile ? 'max-w-none' : ''}`}>
      <div className={`relative transition-all duration-300`}>
        <Search 
          className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
            isFocused ? 'text-[#E50914]' : 'text-gray-500'
          }`} 
        />
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search videos, tags, creators..."
          className="w-full bg-gray-900/80 border-2 text-ellipsis border-gray-800 rounded-full pl-12 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] focus:bg-gray-900 transition-all duration-300"
        />
        {localSearch && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E50914] transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}