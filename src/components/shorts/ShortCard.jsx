import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Music,
  MoreVertical,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ShareModal from '../common/ShareModal';

export default function ShortCard({ short, isActive }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(short.likes || '1.2M');
  const [disliked, setDisliked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toggleSubscription, isSubscribed, showToast } = useApp();

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      showToast('Removed like');
    } else {
      setLiked(true);
      setDisliked(false);
      showToast('Liked short ❤️');
    }
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (!disliked) setLiked(false);
  };

  // Safe embed for YouTube Shorts with native Android support
  const [isMuted, setIsMuted] = useState(false);
  const isNative = typeof window !== 'undefined' && (window.Capacitor?.isNativePlatform?.() || window.location.protocol === 'capacitor:');
  const embedUrl = `https://www.youtube-nocookie.com/embed/${short.id}?autoplay=${isActive ? 1 : 0}&loop=1&playlist=${short.id}&controls=0&modestbranding=1&rel=0&playsinline=1&mute=${isMuted ? 1 : 0}&iv_load_policy=3&enablejsapi=1&vq=hd1080${isNative ? '' : `&origin=${encodeURIComponent(window.location.origin)}`}`;

  return (
    <div className="relative w-full h-full sm:max-w-[420px] sm:h-[calc(100vh-5rem)] sm:max-h-[760px] mx-auto rounded-none sm:rounded-3xl overflow-hidden bg-black shadow-2xl flex items-center justify-center sm:border sm:border-neutral-800/80 group">
      {/* Video Container - Edge to edge fit */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <iframe
          src={embedUrl}
          title={short.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-[108%] -mt-[4%] object-cover border-0 pointer-events-auto"
        />
      </div>

      {/* Top Floating Branding & Sound Control */}
      <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
          <span className="text-[11px] font-black tracking-wider uppercase text-neutral-100">PlayTube</span>
          <span className="text-[10px] font-bold text-red-500">Shorts</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/10 transition shadow-lg"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Floating Left Bottom Meta Overlay */}
      <div className="absolute bottom-4 left-3 right-16 z-20 pointer-events-auto text-white">
        {/* Channel Row */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={short.channelAvatar}
            alt={short.channel}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
          />
          <span className="text-sm font-bold text-white drop-shadow">
            @{short.channel.replace(/\s+/g, '')}
          </span>
          <button
            onClick={() => toggleSubscription({ name: short.channel, avatar: short.channelAvatar })}
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow transition ${
              isSubscribed(short.channel)
                ? 'bg-neutral-800 text-neutral-300'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {isSubscribed(short.channel) ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Short Title */}
        <p className="text-xs sm:text-sm font-medium line-clamp-2 drop-shadow leading-snug">
          {short.title}
        </p>

        {/* Music Sound Track Badge with Rotating Disc */}
        <div className="flex items-center gap-2 mt-2 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit max-w-full">
          <Music className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
          <span className="text-xs text-neutral-200 truncate">{short.musicTitle || 'Original Audio'}</span>
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-neutral-800 to-red-600 animate-spin shrink-0"></div>
        </div>
      </div>

      {/* Right Side Vertical Floating Actions Overlay */}
      <div className="absolute bottom-4 right-2 z-20 flex flex-col items-center gap-4 text-white">
        {/* Like */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center group"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition ${
            liked ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' : 'bg-black/50 text-white hover:bg-black/70'
          }`}>
            <ThumbsUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium mt-1 drop-shadow">{likeCount}</span>
        </button>

        {/* Dislike */}
        <button
          onClick={handleDislike}
          className="flex flex-col items-center group"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition ${
            disliked ? 'bg-neutral-800 text-red-500' : 'bg-black/50 text-white hover:bg-black/70'
          }`}>
            <ThumbsDown className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium mt-1 drop-shadow">Dislike</span>
        </button>

        {/* Comments */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-col items-center group"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium mt-1 drop-shadow">{short.commentsCount || '1.2K'}</span>
        </button>

        {/* Share */}
        <button
          onClick={() => setShareOpen(true)}
          className="flex flex-col items-center group"
        >
          <div className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium mt-1 drop-shadow">Share</span>
        </button>
      </div>

      {/* Comments Drawer for Shorts */}
      {showComments && (
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[#1e1e1e] rounded-t-2xl z-30 p-4 border-t border-neutral-700 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-700">
            <h4 className="font-bold text-sm text-neutral-100">Comments ({short.commentsCount})</h4>
            <button
              onClick={() => setShowComments(false)}
              className="text-neutral-400 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
          <div className="py-4 space-y-3 overflow-y-auto max-h-[calc(100%-3rem)] text-xs text-neutral-300">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 font-bold flex items-center justify-center text-white shrink-0">M</div>
              <div>
                <span className="font-semibold text-neutral-200">@music_lover</span>
                <p className="mt-0.5 text-neutral-300">This short is on repeat! So wholesome ✨</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-red-600 font-bold flex items-center justify-center text-white shrink-0">A</div>
              <div>
                <span className="font-semibold text-neutral-200">@arijit_fanclub</span>
                <p className="mt-0.5 text-neutral-300">King of melody! Nobody comes close.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal video={short} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
