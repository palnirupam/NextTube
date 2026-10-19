import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Compass } from 'lucide-react';
import { getShortsFeed } from '../services/api';
import ShortCard from '../components/shorts/ShortCard';

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Fetch live YouTube Shorts on mount
  useEffect(() => {
    let active = true;
    getShortsFeed().then((items) => {
      if (active && items && items.length > 0) {
        setShorts(items);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Scroll to specific index smoothly
  const scrollToIndex = (index) => {
    if (!containerRef.current) return;
    const clamped = Math.max(0, Math.min(index, shorts.length - 1));
    const targetY = clamped * containerRef.current.clientHeight;
    containerRef.current.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    setActiveIndex(clamped);
  };

  const handleNext = () => scrollToIndex(activeIndex + 1);
  const handlePrev = () => scrollToIndex(activeIndex - 1);

  // Detect which short is in view during scroll
  const handleScroll = (e) => {
    const el = e.currentTarget;
    const itemHeight = el.clientHeight;
    if (itemHeight <= 0) return;
    const current = Math.round(el.scrollTop / itemHeight);
    if (current !== activeIndex && current >= 0 && current < shorts.length) {
      setActiveIndex(current);
    }
  };

  // Keyboard Navigation: Up/Down arrow keys
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
  }, [activeIndex, shorts.length]);

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] bg-neutral-900 dark:bg-[#0f0f0f] relative overflow-hidden flex items-center justify-center transition-colors duration-200">
      {/* Vertical Snap Container for Native Mouse Wheel & Touch Swiping */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {shorts.map((short, index) => (
          <section
            key={short.id + '-' + index}
            className="w-full h-[calc(100vh-3.5rem)] shrink-0 snap-start snap-always flex items-center justify-center p-2 sm:p-4 relative"
          >
            <ShortCard
              short={short}
              isActive={index === activeIndex}
            />
          </section>
        ))}
      </div>

      {/* Floating Desktop Navigation Buttons */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-6 xl:right-12 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="p-3.5 rounded-full bg-neutral-850 hover:bg-neutral-750 disabled:opacity-20 text-white transition-all shadow-2xl border border-neutral-700/80 active:scale-90"
          title="Previous Short (Up Arrow / Scroll Up)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <div className="text-center font-mono text-[10px] text-neutral-400 font-bold bg-black/60 px-2 py-1 rounded-full border border-neutral-800">
          {activeIndex + 1} / {shorts.length}
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex === shorts.length - 1}
          className="p-3.5 rounded-full bg-neutral-850 hover:bg-neutral-750 disabled:opacity-20 text-white transition-all shadow-2xl border border-neutral-700/80 active:scale-90"
          title="Next Short (Down Arrow / Scroll Down)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
