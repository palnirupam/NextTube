import React from 'react';
import { useApp } from '../context/AppContext';
import { History, ThumbsUp, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VideoCard from '../components/common/VideoCard';

export default function LibraryPage() {
  const { watchHistory, likedVideos, watchLater, subscriptions } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white px-3 sm:px-6 pt-4 max-w-[2000px] mx-auto transition-colors duration-200">
      {/* User Header Profile Card */}
      <div className="p-6 bg-white dark:bg-gradient-to-r dark:from-neutral-900 dark:via-neutral-850 dark:to-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg ring-4 ring-red-500/20">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">PlayTube Streamer</h1>
              <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold text-xs tracking-wider">
                VIP
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">@playtube_vip_member</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Ad-Free Architecture Active • Unlimited Free Streams</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-4 sm:gap-8 bg-neutral-100 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700/50">
          <div className="text-center">
            <span className="block text-lg font-bold text-neutral-900 dark:text-neutral-100">{watchHistory.length}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">History</span>
          </div>
          <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700"></div>
          <div className="text-center">
            <span className="block text-lg font-bold text-neutral-900 dark:text-neutral-100">{likedVideos.length}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Liked</span>
          </div>
          <div className="h-8 w-px bg-neutral-300 dark:bg-neutral-700"></div>
          <div className="text-center">
            <span className="block text-lg font-bold text-neutral-900 dark:text-neutral-100">{subscriptions.length}</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Subscriptions</span>
          </div>
        </div>
      </div>

      {/* History Shelf */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">History</h2>
          </div>
          <Link
            to="/history"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            See all ({watchHistory.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {watchHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchHistory.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm italic">No videos watched yet.</p>
        )}
      </div>

      {/* Liked Videos Shelf */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <ThumbsUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Liked Videos</h2>
          </div>
          <Link
            to="/liked"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            See all ({likedVideos.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {likedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likedVideos.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm italic">No liked videos yet.</p>
        )}
      </div>

      {/* Watch Later Shelf */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Watch Later</h2>
          </div>
          <Link
            to="/watch-later"
            className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
          >
            See all ({watchLater.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {watchLater.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchLater.slice(0, 4).map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm italic">No videos saved for later.</p>
        )}
      </div>
    </div>
  );
}
