import React, { useState } from 'react';
import {
  MoreVertical,
  Clock,
  ThumbsUp,
  Share2,
  Download,
  Ban,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatViews } from '../../utils/formatters';
import ShareModal from './ShareModal';
import DownloadModal from './DownloadModal';

export default function VideoCard({ video }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const navigate = useNavigate();

  const {
    toggleWatchLater,
    isWatchLater,
    toggleLikeVideo,
    isLiked,
    toggleDislikeVideo,
    addToHistory
  } = useApp();

  if (!video) return null;

  const handleCardClick = () => {
    addToHistory(video);
    navigate(`/watch?v=${video.id}`);
  };

  const isLive = video.duration === 'LIVE' || video.views?.toString().includes('watching');

  return (
    <div className="flex flex-col group cursor-pointer relative select-none">
      {/* Thumbnail Container */}
      <div
        onClick={handleCardClick}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 group-hover:rounded-none sm:group-hover:rounded-2xl transition-all duration-300 shadow-md"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to high quality YouTube thumbnail if remote image fails
            e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />

        {/* Hover Dark Overlay with Play Icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>

        {/* Duration / LIVE Badge */}
        <div className="absolute bottom-2 right-2">
          {isLive ? (
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-black/80 text-white text-xs font-semibold tracking-tight shadow">
              {video.duration || '3:45'}
            </span>
          )}
        </div>
      </div>

      {/* Video Info Meta Row */}
      <div className="flex gap-3 mt-3 px-1 items-start">
        {/* Channel Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/search?q=${encodeURIComponent(video.channel)}`);
          }}
          className="shrink-0 pt-0.5"
        >
          <img
            src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.channel}`}
            alt={video.channel}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700/60 hover:ring-red-500 transition"
          />
        </div>

        {/* Title, Channel & Stats */}
        <div onClick={handleCardClick} className="flex-1 min-w-0 pr-1">
          <h3
            title={video.title}
            className="text-sm font-semibold text-neutral-100 line-clamp-2 leading-snug group-hover:text-neutral-200"
          >
            {video.title}
          </h3>

          <div className="mt-1 text-xs text-neutral-400 flex flex-col sm:flex-row sm:items-center sm:gap-1.5 flex-wrap">
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/search?q=${encodeURIComponent(video.channel)}`);
              }}
              className="hover:text-neutral-200 transition font-medium flex items-center gap-1"
            >
              {video.channel}
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400 text-[#0f0f0f]" />
            </span>

            <div className="flex items-center gap-1 text-neutral-400">
              <span className="hidden sm:inline">•</span>
              <span>{formatViews(video.views)}</span>
              <span>•</span>
              <span>{video.timestamp || '1 year ago'}</span>
            </div>
          </div>
        </div>

        {/* 3-Dots Action Menu */}
        <div className="relative shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 opacity-80 sm:opacity-0 group-hover:opacity-100 transition"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 w-52 bg-[#282828] text-white rounded-xl shadow-2xl border border-neutral-700 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={() => {
                  toggleWatchLater(video);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
              >
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{isWatchLater(video.id) ? 'Remove from Watch Later' : 'Save to Watch Later'}</span>
              </button>

              <button
                onClick={() => {
                  toggleLikeVideo(video);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
              >
                <ThumbsUp className="w-4 h-4 text-neutral-400" />
                <span>{isLiked(video.id) ? 'Unlike Video' : 'Add to Liked Videos'}</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setShareOpen(true);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
              >
                <Share2 className="w-4 h-4 text-neutral-400" />
                <span>Share Video</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setDownloadOpen(true);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
              >
                <Download className="w-4 h-4 text-neutral-400" />
                <span>Download (MP4 / MP3)</span>
              </button>

              <div className="h-px bg-neutral-700 my-1"></div>

              <button
                onClick={() => {
                  toggleDislikeVideo(video.id);
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-3 text-neutral-400 hover:text-red-400 hover:bg-neutral-700/60 transition"
              >
                <Ban className="w-4 h-4" />
                <span>Not Interested</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share & Download Modals */}
      <ShareModal video={video} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <DownloadModal video={video} isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  );
}
