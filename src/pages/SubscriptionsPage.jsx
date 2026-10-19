import React from 'react';
import { useApp } from '../context/AppContext';
import { CURATED_VIDEOS } from '../services/api';
import VideoCard from '../components/common/VideoCard';
import { Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionsPage() {
  const { subscriptions } = useApp();
  const navigate = useNavigate();

  const subChannelNames = subscriptions.map(s => s.name.toLowerCase());
  const subscriptionVideos = CURATED_VIDEOS.filter(v =>
    subChannelNames.some(name => v.channel.toLowerCase().includes(name))
  );

  const displayVideos = subscriptionVideos.length > 0 ? subscriptionVideos : CURATED_VIDEOS;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-7 gap-x-4">
          {displayVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
