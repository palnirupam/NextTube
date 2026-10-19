import React from 'react';
import { Bell, CheckCheck, Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { showToast } = useApp();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      channel: 'Sony Music India',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
      title: 'Arijit Singh & Pritam released new Kesariya Unplugged version!',
      time: '2 hours ago',
      videoId: 'fJ9rUzIMcZQ',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&h=70&fit=crop',
      unread: true
    },
    {
      id: 2,
      channel: 'Lofi Girl',
      avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&h=100&fit=crop',
      title: 'lofi hip hop radio is live with new cozy chill winter beats ☕',
      time: '5 hours ago',
      videoId: 'jfKfPfyJRdk',
      thumbnail: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=120&h=70&fit=crop',
      unread: true
    },
    {
      id: 3,
      channel: 'Taylor Swift',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      title: 'Blank Space behind-the-scenes recording session uploaded',
      time: '1 day ago',
      videoId: 'e-ORhEE9VVg',
      thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=120&h=70&fit=crop',
      unread: false
    }
  ];

  const handleOpen = (videoId) => {
    onClose();
    navigate(`/watch?v=${videoId}`);
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#282828] dark:bg-[#282828] text-white rounded-2xl shadow-2xl border border-neutral-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
        <h4 className="font-semibold text-sm text-neutral-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-500" /> Notifications
        </h4>
        <button
          onClick={() => showToast('All notifications marked as read')}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition"
        >
          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="divide-y divide-neutral-800 max-h-96 overflow-y-auto">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item.videoId)}
            className="flex gap-3 p-3.5 hover:bg-neutral-700/60 transition cursor-pointer group"
          >
            <img
              src={item.avatar}
              alt={item.channel}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-200 group-hover:text-red-400 transition truncate">
                {item.channel}
              </p>
              <p className="text-xs text-neutral-300 line-clamp-2 mt-0.5 leading-snug">
                {item.title}
              </p>
              <span className="text-[10px] text-neutral-400 mt-1 block">{item.time}</span>
            </div>
            <img
              src={item.thumbnail}
              alt=""
              className="w-16 h-10 object-cover rounded shrink-0 group-hover:scale-105 transition"
            />
          </div>
        ))}
      </div>

      <div className="p-2 text-center border-t border-neutral-700 bg-neutral-900/40">
        <button
          onClick={() => {
            onClose();
            navigate('/subscriptions');
          }}
          className="text-xs text-neutral-400 hover:text-white font-medium py-1 w-full"
        >
          Manage Subscriptions
        </button>
      </div>
    </div>
  );
}
