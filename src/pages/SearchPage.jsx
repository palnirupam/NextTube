import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchVideos } from '../services/api';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, CheckCircle2, Play, Sparkles, User } from 'lucide-react';
import ChannelCard from '../components/common/ChannelCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToHistory } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);

    searchVideos(query).then((items) => {
      if (active) {
        // Extract channels and videos
        const chanList = items.channels || items.filter(x => x.isChannel);
        const vidList = items.videos || items.filter(x => !x.isChannel);
        setChannels(chanList);
        setResults(vidList);
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
    'Palash Tech',
    'Shreya Ghoshal',
    'Chai aur Code',
    'Taylor Swift',
    'Minecraft Speedrun',
    'Lo-fi Girl',
    'React 19'
  ];

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white px-3 sm:px-6 pt-4 max-w-[1500px] mx-auto transition-colors duration-200">
      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {quickArtists.map((artist) => (
          <button
            key={artist}
            onClick={() => navigate(`/search?q=${encodeURIComponent(artist)}`)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              query.toLowerCase() === artist.toLowerCase()
                ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                : 'bg-white dark:bg-neutral-800/80 border-neutral-300 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105'
            }`}
          >
            {artist}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <span>Results for</span>
            <span className="text-red-500 font-extrabold">"{query || 'All Videos'}"</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {channels.length > 0 ? `${channels.length} Creator Channels • ` : ''}
            {results.length} live streaming streams found
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition border border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white shadow-sm">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Loading Skeleton with Shimmer Wave */}
      {loading ? (
        <div className="space-y-6">
          <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-850 rounded-3xl animate-pulse"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 animate-pulse">
              <div className="w-full sm:w-80 aspect-video bg-neutral-200 dark:bg-neutral-800 rounded-2xl shrink-0"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Creator Channel Cards (for small & large channels) */}
          {channels.length > 0 && (
            <div className="space-y-4 mb-6">
              {channels.map((chan) => (
                <ChannelCard key={chan.id || chan.title} channel={chan} />
              ))}
            </div>
          )}

          {/* Search Video Results List */}
          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="flex flex-col sm:flex-row gap-4 p-2.5 rounded-2xl hover:bg-neutral-200/50 dark:hover:bg-neutral-850/80 transition-all duration-300 ease-out cursor-pointer group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-red-950/20 hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-700/50"
                >
                  {/* Thumbnail with Ambient Light Hover */}
                  <div className="relative w-full sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 shrink-0 shadow-md">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow">
                      {video.duration || '3:45'}
                    </span>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>

                  {/* Video Meta */}
                  <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                      {video.views} • {video.timestamp}
                    </p>

                    {/* Channel Pill */}
                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(video.channel)}`}
                        alt={video.channel}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700 group-hover:ring-red-500 transition-all"
                      />
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1">
                        {video.channel}
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 fill-neutral-500 dark:fill-neutral-400 text-white dark:text-[#0f0f0f]" />
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-semibold uppercase tracking-wider border border-neutral-300 dark:border-neutral-700">
                        HD 1080p
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 text-[10px] font-semibold uppercase tracking-wider border border-red-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Ad-Free
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            channels.length === 0 && (
              <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
                <Search className="w-12 h-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-600" />
                <p className="text-base font-semibold">No results found for "{query}"</p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Check spelling or search for another creator or video.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
