import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown, Compass, Loader2 } from 'lucide-react';
import { getShortsFeed } from '../services/api';
import ShortCard from '../components/shorts/ShortCard';

export default function ShortsPage() {
  const [shorts, setShorts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const isLoadingRef = useRef(false);
  const containerRef = useRef(null);

  // Fetch initial batch of live YouTube Shorts on mount
  useEffect(() => {
    let active = true;
    isLoadingRef.current = true;
    getShortsFeed(1).then((items) => {
      if (active && items && items.length > 0) {
        setShorts(items);
      }
      isLoadingRef.current = false;
    }).catch(() => {
      isLoadingRef.current = false;
    });
    return () => {
      active = false;
    };
  }, []);

  // Endless pagination: pre-fetch next batch of shorts seamlessly
  const loadMore = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoadingMore(true);

    const nextPage = page + 1;
    try {
      const moreItems = await getShortsFeed(nextPage);
      if (moreItems && moreItems.length > 0) {
        setShorts((prev) => {
          const existingIds = new Set(prev.map(s => s.id));
          const uniqueNew = moreItems.filter(s => !existingIds.has(s.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      }
    } catch (e) {
      console.warn('Endless shorts loading notice:', e);
    } finally {
      isLoadingRef.current = false;
      setLoadingMore(false);
    }
  }, [page]);

  // When user approaches within 4 shorts from the bottom, prefetch next batch
  useEffect(() => {
    if (shorts.length > 0 && activeIndex >= shorts.length - 4 && !isLoadingRef.current) {
      loadMore();
    }
  }, [activeIndex, shorts.length, loadMore]);

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
    <div className="flex-1 h-[calc(100dvh-3.5rem)] bg-black relative overflow-hidden flex items-center justify-center">
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
            className="w-full h-[calc(100dvh-3.5rem)] shrink-0 snap-start snap-always flex items-center justify-center p-0 sm:p-3 relative"
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

        <div className="text-center font-mono text-[10px] text-neutral-400 font-bold bg-black/60 px-2.5 py-1 rounded-full border border-neutral-800 flex items-center justify-center gap-1">
          {loadingMore && <Loader2 className="w-3 h-3 animate-spin text-red-500" />}
          <span>{activeIndex + 1} / {shorts.length}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={activeIndex >= shorts.length - 1 && loadingMore}
          className="p-3.5 rounded-full bg-neutral-850 hover:bg-neutral-750 disabled:opacity-20 text-white transition-all shadow-2xl border border-neutral-700/80 active:scale-90"
          title="Next Short (Down Arrow / Scroll Down)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
