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
    <div className="sticky top-14 z-30 bg-neutral-50/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md py-2.5 px-3 sm:px-4 border-b border-neutral-200 dark:border-neutral-800/40 flex items-center transition-colors duration-200">
      {/* Left Scroll Arrow */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden sm:flex items-center justify-center p-1.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white mr-2 border border-neutral-200 dark:border-neutral-800 shrink-0 transition shadow-sm"
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
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-200/70 hover:bg-neutral-200 text-neutral-800 border border-neutral-300/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 dark:text-neutral-200 dark:border-neutral-700/40'
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
        className="hidden sm:flex items-center justify-center p-1.5 rounded-full bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white ml-2 border border-neutral-200 dark:border-neutral-800 shrink-0 transition shadow-sm"
        title="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
