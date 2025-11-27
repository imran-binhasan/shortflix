'use client';

import { Videotape, Upload } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';
import TrendingButton from './TrendingButton';

export default function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl">
      <div className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 shrink-0 group transition-all duration-300"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#E50914] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <Videotape className="h-9 w-9 text-[#E50914] relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className={`transition-all duration-300 ${
              isSearchFocused ? 'hidden sm:block' : 'block'
            }`}>
              <h1 className="text-2xl font-black text-[#E50914] tracking-tight hidden sm:block">
                SHORT-FLIX
              </h1>
              <div className="block sm:hidden">
                <h1 className="text-lg font-black text-[#E50914] tracking-tighter -mb-1.5">SHORT</h1>
                <h1 className="text-lg font-black text-[#E50914] tracking-tighter -mt-1.5">FLIX</h1>
              </div>
              <p className="text-[10px] text-gray-500 -mt-1 hidden sm:block">Shorts Platform</p>
            </div>
          </Link>

          <SearchBar onFocusChange={setIsSearchFocused} />


          <div className={`flex items-center gap-2 transition-all duration-300 ${
            isSearchFocused ? 'hidden sm:flex' : 'flex'
          }`}>
            <TrendingButton />
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#E50914] to-[#c20913] rounded-full hover:shadow-lg hover:shadow-red-900/50 transition-all duration-300 group"
            >
              <Upload className="h-6 sm:h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-semibold text-white hidden sm:inline">Add Video</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}