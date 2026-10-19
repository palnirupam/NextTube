import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, Trash2, Search, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatViews } from '../utils/formatters';

export default function HistoryPage() {
  const { watchHistory, removeFromHistory, clearHistory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredHistory = watchHistory.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#0f0f0f] pb-24 md:pb-12 text-white px-3 sm:px-6 pt-4 max-w-[1400px] mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-neutral-100">
            <History className="w-6 h-6 text-red-500" /> Watch History
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {watchHistory.length} videos in your history
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search inside History */}
          <div className="flex items-center bg-[#1e1e1e] border border-neutral-700 rounded-full px-3 py-1.5 w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="bg-transparent border-none outline-none text-xs text-neutral-100 px-2 w-full placeholder-neutral-500"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Clear History Button */}
          {watchHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 border border-red-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* History List */}
      <div className="mt-6 space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/watch?v=${video.id}`)}
              className="flex flex-col sm:flex-row gap-4 p-2.5 rounded-2xl hover:bg-neutral-800/50 transition cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-64 aspect-video rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold">
                  {video.duration}
                </span>
              </div>

              {/* Meta details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                  <h3 className="text-base font-semibold text-neutral-100 group-hover:text-red-400 transition line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">
                    {video.channel} • {formatViews(video.views)} • {video.timestamp}
                  </p>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Watched on PlayTube
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromHistory(video.id);
                    }}
                    className="p-1.5 text-neutral-500 hover:text-red-400 rounded-full hover:bg-neutral-700 transition"
                    title="Remove from history"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-neutral-400">
            <History className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
            <p className="text-base font-semibold">No watch history found</p>
            <p className="text-xs text-neutral-500 mt-1">Videos you watch will show up here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
