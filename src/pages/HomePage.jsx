import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getHomeFeed } from '../services/api';
import CategoryChips from '../components/common/CategoryChips';
import VideoCard from '../components/common/VideoCard';
import { Film, ChevronRight, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { activeCategory, setActiveCategory } = useApp();
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observerTarget = useRef(null);

  // Load Initial Feed when category changes
  useEffect(() => {
    let active = true;
    setLoading(true);
    setPage(1);
    setHasMore(true);

    getHomeFeed(activeCategory, 1).then((res) => {
      if (active) {
        setVideos(res.videos || []);
        if (res.shorts && res.shorts.length > 0) {
          setShorts(res.shorts);
        }
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [activeCategory]);

  // Load More Videos for Continuous Streaming (List by List)
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await getHomeFeed(activeCategory, nextPage);
      if (res.videos && res.videos.length > 0) {
        // Prevent duplicate IDs
        setVideos((prev) => {
          const existingIds = new Set(prev.map(v => v.id));
          const newUnique = res.videos.filter(v => !existingIds.has(v.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
        if (nextPage >= 5) setHasMore(false); // Cap after 5 continuous batches
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.warn('Infinite scroll load notice:', e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, activeCategory]);

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white transition-colors duration-200">
      {/* Category Chips Bar */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Video Feed Container */}
      <main className="max-w-[2200px] mx-auto px-3 sm:px-6 py-4">
        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8 gap-x-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-850 rounded-2xl w-full"></div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-300 dark:bg-neutral-800 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-300 dark:bg-neutral-800 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-300 dark:bg-neutral-800 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Top Grid of Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
              {videos.slice(0, 8).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* YouTube Shorts Shelf (Horizontal preview on Home) */}
            <div className="my-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
                    <Film className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>PlayTube Shorts</span>
                    <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      Trending
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/shorts')}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {shorts.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate('/shorts')}
                    className="group cursor-pointer flex flex-col relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow hover:shadow-red-500/15 transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={s.thumbnail || `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`}
                      alt={s.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = `https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                        {s.title}
                      </p>
                      <span className="text-[11px] text-neutral-300 mt-1 font-medium">
                        {s.likes || 'Trending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continuous Video Feed (Remaining Videos List by List) */}
            {videos.length > 8 && (
              <div>
                <div className="flex items-center justify-between mb-4 mt-6">
                  <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>Recommended For You ({videos.length} videos)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
                  {videos.slice(8).map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </div>
            )}

            {/* Load More Continuous Stream Button & Trigger */}
            <div ref={observerTarget} className="mt-12 flex flex-col items-center justify-center pb-8">
              {hasMore ? (
                <button
                  onClick={loadMoreVideos}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-800 hover:text-neutral-950 border-neutral-300/80 shadow-md dark:bg-neutral-850 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:hover:text-white font-bold text-sm dark:border-neutral-700/80 transition flex items-center gap-2 active:scale-95"
                >
                  {loadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Streaming More Videos...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-red-500" />
                      <span>Load More Videos (Next Stream)</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-neutral-500">You've reached the end of this category stream.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
