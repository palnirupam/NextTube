import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Bookmark,
  CheckCircle2,
  Bell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getVideoDetails } from '../services/api';
import { formatViews } from '../utils/formatters';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/player/VideoPlayer';
import CommentsSection from '../components/player/CommentsSection';
import RelatedVideos from '../components/player/RelatedVideos';
import ShareModal from '../components/common/ShareModal';
import DownloadModal from '../components/common/DownloadModal';

export default function WatchPage() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('v') || 'fJ9rUzIMcZQ';
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTheater, setIsTheater] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const nextVideoRef = useRef(null);

  const {
    isLiked,
    toggleLikeVideo,
    isDisliked,
    toggleDislikeVideo,
    isSubscribed,
    toggleSubscription,
    isWatchLater,
    toggleWatchLater,
    addToHistory,
    showToast
  } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDescExpanded(false);

    getVideoDetails(videoId).then((details) => {
      if (active) {
        setVideo(details);
        setLoading(false);
        addToHistory(details);
      }
    });

    return () => {
      active = false;
    };
  }, [videoId]);

  // Autoplay next video automatically when current video finishes
  const handleVideoEnded = () => {
    if (autoplay && nextVideoRef.current && nextVideoRef.current.id) {
      showToast(`Autoplaying next: ${nextVideoRef.current.title.slice(0, 30)}...`);
      navigate(`/watch?v=${nextVideoRef.current.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading || !video) {
    return (
      <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] p-4 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading PlayTube stream...</p>
        </div>
      </div>
    );
  }

  const liked = isLiked(video.id);
  const disliked = isDisliked(video.id);
  const subscribed = isSubscribed(video.channel);
  const savedLater = isWatchLater(video.id);

  return (
    <div className="flex-1 min-h-screen bg-white dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white transition-colors duration-200">
      {/* Theater Mode Full-Width Container */}
      {isTheater && (
        <div className="w-full bg-black mb-6">
          <div className="max-w-6xl mx-auto">
            <VideoPlayer
              key={video.id}
              videoId={video.id}
              title={video.title}
              isTheater={isTheater}
              onToggleTheater={() => setIsTheater(false)}
              onEnded={handleVideoEnded}
            />
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-[1750px] mx-auto px-3 sm:px-6 pt-3 lg:pt-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left / Main Column */}
          <div className="flex-1 min-w-0">
            {/* Standard Mode Player */}
            {!isTheater && (
              <VideoPlayer
                key={video.id}
                videoId={video.id}
                title={video.title}
                isTheater={isTheater}
                onToggleTheater={() => setIsTheater(true)}
                onEnded={handleVideoEnded}
              />
            )}

            {/* Video Title */}
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-4 leading-snug">
              {video.title}
            </h1>

            {/* Channel Info & Action Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              {/* Channel Meta */}
              <div className="flex items-center gap-3">
                <img
                  src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.channel}`}
                  alt={video.channel}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(video.channel)}`)}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-neutral-300 dark:ring-neutral-700 cursor-pointer hover:ring-red-500 transition"
                />
                <div className="cursor-pointer" onClick={() => navigate(`/search?q=${encodeURIComponent(video.channel)}`)}>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 hover:text-red-500 transition">
                      {video.channel}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400 fill-neutral-500 dark:fill-neutral-400 text-white dark:text-[#0f0f0f]" />
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {video.subscribers?.toLowerCase().includes('sub') ? video.subscribers : `${video.subscribers || '1.4M'} subscribers`}
                  </span>
                </div>

                {/* Subscribe Button */}
                <button
                  onClick={() => toggleSubscription({ name: video.channel, avatar: video.channelAvatar, subscribers: video.subscribers })}
                  className={`ml-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition shadow-md flex items-center gap-1.5 cursor-pointer ${
                    subscribed
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                      : 'bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200'
                  }`}
                >
                  {subscribed ? (
                    <>
                      <Bell className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                      Subscribed
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {/* Like / Dislike Combined Segmented Pill */}
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800/90 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-700/60 shadow-sm">
                  <button
                    onClick={() => toggleLikeVideo(video)}
                    className={`flex items-center gap-2 px-3.5 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition text-xs sm:text-sm font-semibold border-r border-neutral-300 dark:border-neutral-700 cursor-pointer ${
                      liked ? 'text-red-600 font-bold' : 'text-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-red-600' : ''}`} />
                    <span>{liked ? 'Liked' : video.likes || '45K'}</span>
                  </button>
                  <button
                    onClick={() => toggleDislikeVideo(video.id)}
                    className={`px-3 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer ${
                      disliked ? 'text-neutral-500 bg-neutral-200 dark:bg-neutral-700' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                    title="I dislike this"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => setShareOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold transition border border-neutral-300 dark:border-neutral-700/60 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={() => setDownloadOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-semibold transition border border-neutral-300 dark:border-neutral-700/60 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 text-red-600" />
                  <span>Download</span>
                </button>

                {/* Save to Watch Later */}
                <button
                  onClick={() => toggleWatchLater(video)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition text-xs sm:text-sm font-semibold border shadow-sm cursor-pointer ${
                    savedLater
                      ? 'bg-red-500/10 text-red-600 border-red-500/40'
                      : 'bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700/60'
                  }`}
                  title="Save to Watch Later"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{savedLater ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Expandable Description Box */}
            <div
              onClick={() => setDescExpanded(!descExpanded)}
              className="mt-4 p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200/80 dark:hover:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-800 cursor-pointer transition text-xs sm:text-sm shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                <span>{formatViews(video.views)}</span>
                <span>•</span>
                <span>{video.timestamp}</span>
                <span className="text-red-600">#{video.category}</span>
                <span className="text-red-600">#PlayTubeStreaming</span>
              </div>

              <p className={`text-neutral-700 dark:text-neutral-300 leading-relaxed ${descExpanded ? '' : 'line-clamp-2'}`}>
                {video.description}
              </p>

              <div className="mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                <span>{descExpanded ? 'Show less' : '...more'}</span>
                {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Comments Section */}
            <CommentsSection videoId={video.id} />
          </div>

          {/* Right Column / Related Recommendations */}
          <div className="w-full lg:w-96 xl:w-[420px] shrink-0 mt-6 lg:mt-0">
            <RelatedVideos
              currentVideoId={video.id}
              currentCategory={video.category}
              videoTitle={video.title}
              channelName={video.channel}
              autoplay={autoplay}
              onToggleAutoplay={() => setAutoplay(a => !a)}
              onNextVideoDetermined={(nextVid) => {
                nextVideoRef.current = nextVid;
              }}
            />
          </div>
        </div>
      </div>

      {/* Share & Download Modals */}
      <ShareModal video={video} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <DownloadModal video={video} isOpen={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  );
}
