import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchVideos } from '../services/api';
import { formatViews } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, CheckCircle2, Play, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToHistory } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);

    searchVideos(query).then((items) => {
      if (active) {
        setResults(items);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [query]);

  const handleVideoClick = (video) => {
    addToHistory(video);
    navigate(`/watch?v=${video.id}`);
  };

  const quickArtists = [
    'Arijit Singh',
    'Shreya Ghoshal',
    'Taylor Swift',
    'Ed Sheeran',
    'Diljit Dosanjh',
    'Lo-fi Girl',
    'React 19',
    'GTA 6'
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#0f0f0f] pb-24 md:pb-12 text-white px-3 sm:px-6 pt-4 max-w-[1500px] mx-auto">
      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {quickArtists.map((artist) => (
          <button
            key={artist}
            onClick={() => navigate(`/search?q=${encodeURIComponent(artist)}`)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
              query.toLowerCase() === artist.toLowerCase()
                ? 'bg-red-600 border-red-500 text-white'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:text-white hover:bg-neutral-700'
            }`}
          >
            {artist}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
            <span>Results for</span>
            <span className="text-red-500">"{query || 'All Videos'}"</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {results.length} ad-free streaming streams found
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition border border-neutral-700">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="w-full sm:w-80 aspect-video bg-neutral-800 rounded-2xl shrink-0"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-5 bg-neutral-800 rounded w-4/5"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl hover:bg-neutral-800/60 transition cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden bg-neutral-900 shrink-0 shadow-md">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold">
                  {video.duration || '3:45'}
                </span>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Video Meta */}
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-red-400 transition line-clamp-2 leading-snug">
                  {video.title}
                </h3>

                <p className="text-xs text-neutral-400 mt-1 font-medium">
                  {formatViews(video.views)} • {video.timestamp}
                </p>

                {/* Channel Pill */}
                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.channel}`}
                    alt={video.channel}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-700"
                  />
                  <span className="text-xs font-medium text-neutral-300 hover:text-white transition flex items-center gap-1">
                    {video.channel}
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400 text-[#0f0f0f]" />
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-semibold uppercase tracking-wider border border-neutral-700">
                    HD 1080p
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 text-[10px] font-semibold uppercase tracking-wider border border-red-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Ad-Free
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-neutral-400">
          <Search className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
          <p className="text-base font-semibold">No results found for "{query}"</p>
          <p className="text-xs text-neutral-500 mt-1">Try searching another artist or title like Arijit Singh or Taylor Swift.</p>
        </div>
      )}
    </div>
  );
}
