'use client';

import { Videotape, Search, X, TrendingUp, Plus } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
  onTrending?: () => void;
  isTrending?: boolean;
}

export default function Header({ onSearch, searchValue = '', onTrending, isTrending = false }: HeaderProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setLocalSearch('');
    onSearch?.('');
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E50914] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <Videotape className="h-9 w-9 text-[#E50914] relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#E50914] tracking-tight">
                SHORT-FLIX
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1">Shorts Platform</p>
            </div>
          </Link>

          {/* Search Bar */}
          {onSearch && (
            <div className="relative max-w-2xl w-full">
              <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
                <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${isFocused ? 'text-[#E50914]' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search videos, tags, creators..."
                  className="w-full bg-gray-900/80 border-2 border-gray-800 rounded-full pl-12 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] focus:bg-gray-900 transition-all duration-300"
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
          )}

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            {/* Add Video Button */}
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E50914] to-[#c20913] rounded-full hover:shadow-lg hover:shadow-red-900/50 transition-all duration-300 group"
            >
              <Plus className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-semibold text-white hidden sm:inline">Add Video</span>
            </Link>

            {/* Trending Button */}
            {onTrending && (
              <button
                onClick={onTrending}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group ${
                  isTrending
                    ? 'bg-gradient-to-r from-[#E50914] to-[#c20913] text-white shadow-lg shadow-red-900/50'
                    : 'bg-gradient-to-r from-[#E50914]/20 to-orange-600/20 border border-[#E50914]/30 text-[#E50914] hover:shadow-lg hover:shadow-red-900/50'
                }`}
              >
                <TrendingUp className={`h-4 w-4 group-hover:scale-110 transition-transform ${isTrending ? 'text-white' : 'text-[#E50914]'}`} />
                <span className={`text-xs font-semibold ${isTrending ? 'text-white' : 'text-[#E50914]'}`}>TRENDING</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
