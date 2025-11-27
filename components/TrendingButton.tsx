'use client';

import { TrendingUp } from 'lucide-react';
import { useVideoStore } from '@/lib/store';

export default function TrendingButton() {
  const { isTrending, setIsTrending } = useVideoStore();

  const handleToggle = () => {
    setIsTrending(!isTrending);
  };

  return (
    <button
      onClick={handleToggle}
      className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group ${
        isTrending
          ? 'bg-linear-to-r from-[#E50914] to-[#c20913] text-white shadow-lg shadow-red-900/50'
          : 'bg-linear-to-r from-[#E50914]/20 to-orange-600/20 border border-[#E50914]/30 text-[#E50914] hover:shadow-lg hover:shadow-red-900/50'
      }`}
      aria-pressed={isTrending}
      aria-label="Toggle trending videos"
    >
      <TrendingUp 
        className={`h-4 w-4 group-hover:scale-110 transition-transform ${
          isTrending ? 'text-white' : 'text-[#E50914]'
        }`} 
      />
      <span className={`text-xs font-semibold ${isTrending ? 'text-white' : 'text-[#E50914]'}`}>
        TRENDING
      </span>
    </button>
  );
}