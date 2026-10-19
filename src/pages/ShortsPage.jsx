import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { CURATED_SHORTS } from '../services/api';
import ShortCard from '../components/shorts/ShortCard';

export default function ShortsPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    if (activeIndex < CURATED_SHORTS.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  return (
    <div className="flex-1 min-h-[calc(100vh-3.5rem)] bg-[#0f0f0f] py-4 px-2 flex items-center justify-center relative pb-24 md:pb-6 overflow-hidden">
      <div className="relative flex items-center justify-center w-full">
        <ShortCard
          short={CURATED_SHORTS[activeIndex]}
          isActive={true}
        />

        <div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-30">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow-lg border border-neutral-700 backdrop-blur-sm"
            title="Previous Short (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === CURATED_SHORTS.length - 1}
            className="p-3 rounded-full bg-neutral-800/80 hover:bg-neutral-700 disabled:opacity-30 text-white transition shadow-lg border border-neutral-700 backdrop-blur-sm"
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
