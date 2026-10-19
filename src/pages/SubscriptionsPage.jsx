import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { searchVideos } from '../services/api';
import VideoCard from '../components/common/VideoCard';
import { Tv, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionsPage() {
  const { subscriptions } = useApp();
  const navigate = useNavigate();
  const [subVideos, setSubVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (subscriptions.length > 0) {
      setLoading(true);
      const topChannel = subscriptions[0].name;
      searchVideos(topChannel).then((res) => {
        if (active) {
          setSubVideos(res.videos || res || []);
          setLoading(false);
        }
      }).catch(() => {
        if (active) setLoading(false);
      });
    } else {
      setSubVideos([]);
    }
    return () => {
      active = false;
    };
  }, [subscriptions]);

  return (
    <div className="flex-1 min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] pb-24 md:pb-12 text-neutral-900 dark:text-white px-3 sm:px-6 pt-4 max-w-[2000px] mx-auto transition-colors duration-200">
      {/* Top Channels Carousel */}
      <div className="mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <Tv className="w-5 h-5 text-red-500" /> Subscriptions
        </h2>

        {subscriptions.length > 0 ? (
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(sub.name)}`)}
                className="flex flex-col items-center gap-2 group cursor-pointer shrink-0"
              >
                <div className="relative">
                  <img
                    src={sub.avatar}
                    alt={sub.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-300 dark:ring-neutral-700 group-hover:ring-red-500 transition shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-[#0f0f0f]"></span>
                </div>
                <span className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white max-w-[80px] truncate text-center font-medium">
                  {sub.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center shadow-sm">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">You haven't subscribed to any channels yet.</p>
          </div>
        )}
      </div>

      {/* Latest Videos from Subscriptions */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-neutral-900 dark:text-neutral-200">Latest from your channels</h3>
        {loading ? (
          <div className="py-12 flex justify-center text-neutral-500">
            <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
            {subVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center max-w-md mx-auto">
            <Tv className="w-16 h-16 mx-auto text-neutral-400 dark:text-neutral-600 mb-4" />
            <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">Don't miss new videos</h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              Subscribe to your favorite creators to see their latest uploads here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-full shadow-lg transition"
            >
              Explore Trending Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
