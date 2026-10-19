import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelatedVideos, CURATED_VIDEOS } from '../../services/api';
import { formatViews } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';

export default function RelatedVideos({ currentVideoId, currentCategory, videoTitle, channelName }) {
  const [autoplay, setAutoplay] = useState(true);
  const [filter, setFilter] = useState('All');
  const [relatedList, setRelatedList] = useState(CURATED_VIDEOS.filter(v => v.id !== currentVideoId));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToHistory } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);

    getRelatedVideos(currentVideoId, videoTitle || channelName || currentCategory).then((items) => {
      if (active && items && items.length > 0) {
        setRelatedList(items.filter(v => v.id !== currentVideoId));
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [currentVideoId, videoTitle, channelName, currentCategory]);

  const filters = ['All', 'From related artist', 'Related', 'Recently uploaded'];

  const handleVideoClick = (video) => {
    addToHistory(video);
    navigate(`/watch?v=${video.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Autoplay & Filters Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h4 className="text-sm font-bold text-neutral-200">Up next</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Autoplay</span>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
              autoplay ? 'bg-red-600' : 'bg-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
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
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              filter === f
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Video List (Compact YouTube Style) */}
      <div className="space-y-3">
        {relatedList.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="flex gap-3 group cursor-pointer hover:bg-neutral-800/40 p-1.5 rounded-xl transition"
          >
            {/* Thumbnail */}
            <div className="relative w-40 sm:w-44 aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0">
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

            {/* Meta */}
            <div className="flex-1 min-w-0 pr-1">
              <h5 className="text-xs font-semibold text-neutral-100 line-clamp-2 leading-snug group-hover:text-red-400 transition">
                {video.title}
              </h5>
              <p className="text-[11px] text-neutral-400 mt-1 truncate hover:text-neutral-200">
                {video.channel}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {formatViews(video.views)} • {video.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
