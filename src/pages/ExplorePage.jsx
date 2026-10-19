import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Flame, Music2, Gamepad2, Newspaper, Radio, Sparkles } from 'lucide-react';
import { searchVideos, CURATED_VIDEOS } from '../services/api';
import VideoCard from '../components/common/VideoCard';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCat = searchParams.get('cat') || 'Trending';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const exploreTabs = [
    { name: 'Trending', icon: Flame, color: 'from-amber-600 to-red-600' },
    { name: 'Music', icon: Music2, color: 'from-emerald-600 to-teal-700' },
    { name: 'Gaming', icon: Gamepad2, color: 'from-purple-600 to-indigo-700' },
    { name: 'News', icon: Newspaper, color: 'from-blue-600 to-cyan-700' },
    { name: 'Live', icon: Radio, color: 'from-rose-600 to-pink-700' },
  ];

  useEffect(() => {
    let active = true;
    setLoading(true);

    if (currentCat === 'Trending') {
      setVideos(CURATED_VIDEOS);
      setLoading(false);
    } else {
      searchVideos(currentCat).then((data) => {
        if (active) {
          setVideos(data);
          setLoading(false);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [currentCat]);

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white px-3 sm:px-6 pt-4 max-w-[2000px] mx-auto transition-colors duration-200">
      {/* Category Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 mb-8">
        {exploreTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentCat === tab.name;

          return (
            <div
              key={tab.name}
              onClick={() => setSearchParams({ cat: tab.name })}
              className={`p-4 rounded-2xl bg-gradient-to-br ${tab.color} cursor-pointer group shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden ${
                isActive ? 'ring-2 ring-neutral-900 dark:ring-white shadow-2xl' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm sm:text-base text-white">{tab.name}</span>
                <Icon className="w-6 h-6 text-white/90 group-hover:scale-110 transition shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore Section Heading */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Top {currentCat} Streams
        </h2>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-2xl w-full"></div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
