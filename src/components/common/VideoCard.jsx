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

  const handleChannelClick = (e) => {
    e.stopPropagation();
    navigate(`/channel/${encodeURIComponent(video.channelId || video.channel)}?name=${encodeURIComponent(video.channel)}`);
  };

  const isLive = video.duration === 'LIVE' || video.views?.toString().includes('watching');

  return (
    <div className="flex flex-col group cursor-pointer relative select-none rounded-2xl p-1.5 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:bg-neutral-850/60 hover:shadow-2xl hover:shadow-red-950/20 hover:ring-1 hover:ring-neutral-700/50">
      {/* Thumbnail Container with Ambient Hover Glow */}
      <div
        onClick={handleCardClick}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 transition-all duration-300 shadow-md group-hover:shadow-red-600/10"
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />

        {/* Ambient Cinema Light Glow Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-75 group-hover:scale-100 transition-all duration-300 ease-out ring-4 ring-white/20">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>

        {/* Duration / LIVE Frosted Glass Badge */}
        <div className="absolute bottom-2 right-2">
          {isLive ? (
            <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-red-600/40">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              LIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold tracking-tight shadow border border-white/10">
              {video.duration || '3:45'}
            </span>
          )}
        </div>
      </div>

      {/* Video Info Meta Row */}
      <div className="flex gap-3 mt-3 px-1 items-start">
        {/* Channel Avatar with Direct Channel Page Navigation */}
        <div
          onClick={handleChannelClick}
          className="shrink-0 pt-0.5"
          title={`View ${video.channel} Channel`}
        >
          <div className="relative group/avatar">
            <img
              src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(video.channel)}`}
              alt={video.channel}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700/80 group-hover:ring-2 group-hover:ring-red-500 transition-all duration-300 shadow"
            />
          </div>
        </div>

        {/* Title, Channel & Stats */}
        <div onClick={handleCardClick} className="flex-1 min-w-0 pr-1">
          <h3
            title={video.title}
            className="text-sm font-semibold text-neutral-100 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors duration-200"
          >
            {video.title}
          </h3>

          <div className="mt-1 text-xs text-neutral-400 flex flex-col sm:flex-row sm:items-center sm:gap-1.5 flex-wrap">
            <span
              onClick={handleChannelClick}
              className="hover:text-neutral-100 transition font-medium flex items-center gap-1 cursor-pointer"
            >
              {video.channel}
              <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 fill-neutral-400 text-[#0f0f0f]" />
            </span>

            <div className="flex items-center gap-1 text-neutral-400">
              <span className="hidden sm:inline">•</span>
              <span>{video.views}</span>
              <span>•</span>
              <span>{video.timestamp || 'Recently'}</span>
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
              className="absolute right-0 top-8 w-52 bg-[#282828] text-white rounded-2xl shadow-2xl border border-neutral-700 py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md"
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
