'use client';

import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:bg-black/90 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </button>
      )}

      {/* Tags Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-1.5"
        onScroll={checkScrollButtons}
      >
        <button
          onClick={() => onTagSelect(null)}
          className={`flex items-center gap-2 px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap shrink-0 ${
            selectedTag === null
              ? 'bg-linear-to-r from-[#E50914] to-[#c20913] text-white shadow-lg shadow-red-900/50 scale-105'
              : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:scale-105'
          }`}
        >
          {selectedTag === null && <Sparkles className="h-4 w-4" />}
          All Videos
        </button>

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-semibold rounded-full transition-all duration-300 whitespace-nowrap shrink-0 ${
              selectedTag === tag
                ? 'bg-linear-to-r from-[#E50914] to-[#c20913] text-white shadow-lg shadow-red-900/50 scale-105'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:scale-105'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:bg-black/90 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
}
