import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelatedVideos } from '../../services/api';
import { formatViews } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function RelatedVideos({
  currentVideoId,
  currentCategory,
  videoTitle,
  channelName,
  autoplay = true,
  onToggleAutoplay,
  onNextVideoDetermined
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToHistory } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setActiveFilter('All'); // Reset filter on video change

    getRelatedVideos(currentVideoId, videoTitle || channelName || currentCategory).then((items) => {
      if (active) {
        const filtered = (items || []).filter(v => v.id !== currentVideoId);
        setAllVideos(filtered);
        if (filtered[0]) {
          onNextVideoDetermined?.(filtered[0]);
        }
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [currentVideoId, videoTitle, channelName, currentCategory, onNextVideoDetermined]);

  const filters = ['All', 'From related artist', 'Related', 'Recently uploaded'];

  // Actually filter / sort the video list based on active chip
  const displayedVideos = useMemo(() => {
    if (activeFilter === 'All') {
      return allVideos;
    }

    if (activeFilter === 'From related artist') {
      // Show videos from same channel as current video
      const sameChannel = allVideos.filter(
        v => v.channel && channelName && v.channel.toLowerCase() === channelName.toLowerCase()
      );
      // If no exact match, show same category
      if (sameChannel.length > 0) return sameChannel;
      return allVideos.filter(v => v.category && currentCategory && v.category === currentCategory);
    }

    if (activeFilter === 'Related') {
      // Show videos in the same category
      const sameCat = allVideos.filter(
        v => v.category && currentCategory && v.category === currentCategory
      );
      return sameCat.length > 0 ? sameCat : allVideos;
    }

    if (activeFilter === 'Recently uploaded') {
      // Sort: videos with "hours ago", "days ago", "weeks ago" first, then months/years
      const order = ['just now', 'hour', 'day', 'week', 'month', 'year'];
      return [...allVideos].sort((a, b) => {
        const ta = (a.timestamp || '').toLowerCase();
        const tb = (b.timestamp || '').toLowerCase();
        const ai = order.findIndex(k => ta.includes(k));
        const bi = order.findIndex(k => tb.includes(k));
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      });
    }

    return allVideos;
  }, [allVideos, activeFilter, channelName, currentCategory]);

  const handleVideoClick = (video) => {
    addToHistory(video);
    navigate(`/watch?v=${video.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Autoplay & Filters Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-200">Up next</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Autoplay</span>
          <button
            onClick={onToggleAutoplay}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
              autoplay ? 'bg-red-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
            title={`Autoplay is ${autoplay ? 'ON' : 'OFF'}`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                autoplay ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              activeFilter === f
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Video List (Compact YouTube Style) */}
      {loading ? (
        <div className="flex items-center justify-center py-8 gap-2 text-neutral-500 dark:text-neutral-400 text-sm">
          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading suggestions...</span>
        </div>
      ) : displayedVideos.length === 0 ? (
        <div className="py-8 text-center text-neutral-500 dark:text-neutral-400 text-xs">
          No videos found for this filter. Try "All".
        </div>
      ) : (
        <div className="space-y-3">
          {displayedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="flex gap-3 group cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/50 p-1.5 rounded-xl transition"
            >
              {/* Thumbnail */}
              <div className="relative w-40 sm:w-44 aspect-video rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 shrink-0 shadow-sm">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
                  {video.duration}
                </span>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-start">
                <h5 className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-red-600 transition">
                  {video.title}
                </h5>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 hover:text-neutral-900 dark:hover:text-neutral-200 transition">
                  {video.channel}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  <span>{video.views}</span>
                  <span>•</span>
                  <span>{video.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
