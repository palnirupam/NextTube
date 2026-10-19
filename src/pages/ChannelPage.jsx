import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Bell,
  UserPlus,
  Video,
  Share2,
  Search,
  Sparkles,
  Info,
  Play
} from 'lucide-react';
import { getChannelProfile } from '../services/api';
import { useApp } from '../context/AppContext';
import VideoCard from '../components/common/VideoCard';
import ShareModal from '../components/common/ShareModal';

export default function ChannelPage() {
  const { channelId } = useParams();
  const [searchParams] = useSearchParams();
  const channelName = searchParams.get('name') || channelId;
  const navigate = useNavigate();

  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [shareOpen, setShareOpen] = useState(false);

  const { isSubscribed, toggleSubscription, showToast } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);

    getChannelProfile(channelId, channelName).then((res) => {
      if (active) {
        setChannelData(res.channel);
        setVideos(res.videos || []);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [channelId, channelName]);

  if (loading || !channelData) {
    return (
      <div className="flex-1 min-h-screen bg-[#0f0f0f] p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400 text-sm">Loading Creator Profile...</p>
        </div>
      </div>
    );
  }

  const subscribed = isSubscribed(channelData.title);

  return (
    <div className="flex-1 min-h-screen bg-[#0f0f0f] pb-24 md:pb-12 text-white">
      {/* Widescreen Channel Banner Artwork */}
      <div className="w-full h-36 sm:h-52 md:h-64 bg-gradient-to-r from-red-950 via-neutral-900 to-purple-950 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent"></div>
      </div>

      {/* Main Channel Header Container */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 -mt-14 sm:-mt-20 relative z-10 pb-6 border-b border-neutral-800">
          {/* Creator Avatar with Glow Ring */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-[#0f0f0f] shadow-2xl bg-neutral-900">
              <img
                src={channelData.avatar}
                alt={channelData.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channelData.title)}`;
                }}
              />
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 min-w-0 text-center md:text-left pt-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-100 flex items-center justify-center md:justify-start gap-2">
                <span>{channelData.title}</span>
                <CheckCircle2 className="w-6 h-6 text-neutral-400 fill-neutral-400 text-[#0f0f0f] shrink-0" />
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-neutral-400 mt-1.5 font-medium">
              <span className="text-neutral-200 font-bold">{channelData.handle}</span>
              <span>•</span>
              <span className="text-red-400 font-semibold">{channelData.subscribers}</span>
              <span>•</span>
              <span className="text-neutral-300">{videos.length} videos</span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-3xl leading-relaxed">
              {channelData.description}
            </p>

            {/* Subscribe & Share Action Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <button
                onClick={() => toggleSubscription({ name: channelData.title, avatar: channelData.avatar, subscribers: channelData.subscribers })}
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

              <button
                onClick={() => setShareOpen(true)}
                className="px-4 py-2.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-semibold transition border border-neutral-700 flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-neutral-800 text-sm font-bold mt-2">
          {['videos', 'shorts', 'about'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3.5 border-b-2 uppercase tracking-wider text-xs sm:text-sm transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'border-red-600 text-white font-extrabold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-6">
          {activeTab === 'videos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-neutral-200">
                  Uploaded Videos ({videos.length})
                </h3>
              </div>

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
                  {videos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-neutral-400">
                  <Video className="w-12 h-12 mx-auto mb-3 text-neutral-600" />
                  <p className="text-base font-semibold">No video uploads found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shorts' && (
            <div>
              <h3 className="text-base font-bold text-neutral-200 mb-4">Creator Shorts</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {videos.slice(0, 5).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => navigate(`/watch?v=${v.id}`)}
                    className="aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer group relative shadow hover:shadow-red-500/10 transition"
                  >
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                      <p className="text-xs font-semibold text-white line-clamp-2">{v.title}</p>
                      <span className="text-[11px] text-neutral-400 mt-1">{v.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-3xl bg-neutral-900/60 p-6 rounded-3xl border border-neutral-800 space-y-4">
              <h3 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-500" /> About {channelData.title}
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {channelData.description}
              </p>
              <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-400 space-y-2">
                <p>Channel Handle: <span className="text-white font-mono">{channelData.handle}</span></p>
                <p>Subscribers: <span className="text-red-400 font-semibold">{channelData.subscribers}</span></p>
                <p>Verified on PlayTube: <span className="text-emerald-400 font-semibold">Yes • Active Creator</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        video={{ id: channelData.id, title: `${channelData.title} on PlayTube` }}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
