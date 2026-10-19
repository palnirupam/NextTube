import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CURATED_VIDEOS, CURATED_SHORTS, searchVideos } from '../services/api';
import CategoryChips from '../components/common/CategoryChips';
import VideoCard from '../components/common/VideoCard';
import { Film, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { activeCategory, setActiveCategory } = useApp();
  const [videos, setVideos] = useState(CURATED_VIDEOS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    if (activeCategory === 'All') {
      setVideos(CURATED_VIDEOS);
      setLoading(false);
    } else {
      searchVideos(activeCategory).then((results) => {
        setVideos(results);
        setLoading(false);
      });
    }
  }, [activeCategory]);

  return (
    <div className="flex-1 min-h-screen bg-[#0f0f0f] pb-20 md:pb-10">
      {/* Category Chips Bar */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Video Feed Container */}
      <main className="max-w-[2000px] mx-auto px-3 sm:px-6 py-4">
        {loading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8 gap-x-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-video bg-neutral-800 rounded-2xl w-full"></div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
                    <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
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
            <div className="my-10 pt-6 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-600/20 text-red-500">
                    <Film className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-100">PlayTube Shorts</h3>
                </div>
                <button
                  onClick={() => navigate('/shorts')}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {CURATED_SHORTS.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => navigate('/shorts')}
                    className="group cursor-pointer flex flex-col relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800/80 shadow hover:shadow-red-500/10 transition"
                  >
                    <img
                      src={`https://i.ytimg.com/vi/${s.id}/hqdefault.jpg`}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                        {s.title}
                      </p>
                      <span className="text-[11px] text-neutral-400 mt-1 font-medium">
                        {s.likes} likes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining Videos Grid */}
            {videos.length > 8 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4 mt-6">
                {videos.slice(8).map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
