import React from 'react';
import { CheckCircle2, Bell, UserPlus, Users, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ChannelCard({ channel }) {
  const navigate = useNavigate();
  const { toggleSubscription, isSubscribed } = useApp();

  if (!channel) return null;

  const subscribed = isSubscribed(channel.title);

  return (
    <div className="w-full bg-gradient-to-r from-neutral-900/90 via-[#181818] to-neutral-900/90 rounded-3xl p-5 sm:p-7 border border-neutral-800 shadow-xl hover:border-neutral-700 transition-all duration-300 mb-6 group">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">
        {/* Creator Avatar with Glow Ring */}
        <div
          onClick={() => navigate(`/search?q=${encodeURIComponent(channel.title)}`)}
          className="relative cursor-pointer shrink-0"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-neutral-700/80 group-hover:ring-red-500/80 transition-all duration-300 shadow-2xl">
            <img
              src={channel.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channel.title)}`}
              alt={channel.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channel.title)}`;
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 p-1 bg-red-600 rounded-full border-2 border-[#0f0f0f] shadow-md">
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h2
              onClick={() => navigate(`/search?q=${encodeURIComponent(channel.title)}`)}
              className="text-xl sm:text-2xl font-black text-neutral-100 group-hover:text-red-400 transition-colors cursor-pointer truncate"
            >
              {channel.title}
            </h2>
            <CheckCircle2 className="w-5 h-5 text-neutral-400 fill-neutral-400 text-[#0f0f0f] mx-auto sm:mx-0 shrink-0" />
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
            <span className="text-neutral-300 font-semibold">{channel.handle || '@creator'}</span>
            <span>•</span>
            <span className="text-red-400 font-semibold">{channel.subscribers}</span>
            {channel.videoCount && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-neutral-300">
                  <Video className="w-3.5 h-3.5" />
                  {channel.videoCount}
                </span>
              </>
            )}
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 line-clamp-2 max-w-2xl leading-relaxed">
            {channel.description || 'Welcome to the official creator channel. Watch exclusive videos and streaming content on PlayTube.'}
          </p>
        </div>

        {/* Interactive Subscribe Button */}
        <div className="shrink-0 pt-2 sm:pt-4">
          <button
            onClick={() => toggleSubscription({ name: channel.title, avatar: channel.avatar, subscribers: channel.subscribers })}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shadow-lg flex items-center gap-2 active:scale-95 ${
              subscribed
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                : 'bg-white hover:bg-neutral-200 text-neutral-950 hover:shadow-red-500/20'
            }`}
          >
            {subscribed ? (
              <>
                <Bell className="w-4 h-4 text-red-500 fill-red-500" />
                <span>Subscribed</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Subscribe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
