import React from 'react';
import { useApp } from '../context/AppContext';
import { ThumbsUp, Play, Shuffle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatViews } from '../utils/formatters';

export default function LikedVideosPage() {
  const { likedVideos, toggleLikeVideo } = useApp();
  const navigate = useNavigate();

  const handlePlayAll = () => {
    if (likedVideos.length > 0) {
      navigate(`/watch?v=${likedVideos[0].id}`);
    }
  };

  const firstVideo = likedVideos[0];

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white px-3 sm:px-6 pt-4 max-w-[1600px] mx-auto transition-colors duration-200">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Playlist Banner Card */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white dark:bg-gradient-to-b dark:from-red-900/40 dark:via-neutral-900 dark:to-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl sticky top-20">
            {firstVideo ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-4 bg-neutral-200 dark:bg-neutral-900">
                <img
                  src={firstVideo.thumbnail}
                  alt="Liked Videos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <ThumbsUp className="w-10 h-10 text-white fill-white drop-shadow-lg" />
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                <ThumbsUp className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
              </div>
            )}

            <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100">Liked Videos</h1>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-semibold">PlayTube User</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{likedVideos.length} videos • Updated today</p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePlayAll}
                disabled={likedVideos.length === 0}
                className="flex-1 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-black disabled:opacity-50 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play all</span>
              </button>
              <button
                onClick={handlePlayAll}
                disabled={likedVideos.length === 0}
                className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white dark:border-neutral-700 disabled:opacity-50 transition shadow-sm"
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Video List */}
        <div className="flex-1 min-w-0">
          {likedVideos.length > 0 ? (
            <div className="space-y-2">
              {likedVideos.map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/watch?v=${video.id}`)}
                  className="flex items-center gap-4 p-2 rounded-2xl hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition cursor-pointer group"
                >
                  <span className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 w-4 text-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="relative w-36 sm:w-44 aspect-video rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-900 shrink-0 shadow-sm">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-semibold">
                      {video.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                      {video.channel} • {formatViews(video.views)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLikeVideo(video);
                    }}
                    className="p-2 text-neutral-400 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-500 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 opacity-80 sm:opacity-0 group-hover:opacity-100 transition shrink-0"
                    title="Remove from Liked"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500 dark:text-neutral-400">
              <ThumbsUp className="w-12 h-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-600" />
              <p className="text-base font-semibold">No liked videos yet</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Tap the thumbs up button on any video to add it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
