import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CATEGORIES = [
  'All',
  'Music',
  'Bollywood Hits',
  'Gaming',
  'Lo-fi',
  'Live',
  'Coding',
  'Podcasts',
  'Hip Hop',
  'Acoustic',
  'Pop',
  'New Releases',
  'Soundtracks',
  'Relaxing'
];

export default function CategoryChips({ activeCategory, onSelectCategory }) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 z-30 bg-[#0f0f0f] py-2.5 px-3 sm:px-4 border-b border-neutral-800/40 flex items-center">
      {/* Left Scroll Arrow */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden sm:flex items-center justify-center p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white mr-2 border border-neutral-800 shrink-0 transition"
        title="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Scrollable Chip List */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-neutral-100 text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-200 border border-neutral-700/40'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow */}
      <button
        onClick={() => handleScroll('right')}
        className="hidden sm:flex items-center justify-center p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white ml-2 border border-neutral-800 shrink-0 transition"
        title="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
