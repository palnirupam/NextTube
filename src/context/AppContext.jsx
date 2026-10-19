import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURATED_VIDEOS } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Theme: default dark (#0f0f0f)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('playtube_theme') || 'dark';
  });

  // Desktop sidebar collapsed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Active Category Chip
  const [activeCategory, setActiveCategory] = useState('All');

  // Search History
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_search_history')) || [
        'Arijit Singh',
        'Shreya Ghoshal',
        'Taylor Swift',
        'Lofi hip hop beats',
        'React 19 tutorial'
      ];
    } catch {
      return [];
    }
  });

  // Liked Videos
  const [likedVideos, setLikedVideos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_liked')) || [CURATED_VIDEOS[0]];
    } catch {
      return [];
    }
  });

  // Disliked Video IDs
  const [dislikedIds, setDislikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_disliked')) || [];
    } catch {
      return [];
    }
  });

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_subs')) || [
        {
          id: 'UCq-Fj5jknLsUf-MWSy4_brA',
          name: 'Sony Music India',
          avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
          subscribers: '62.4M'
        },
        {
          id: 'UCSJ4gkVC6NrvII8umztf0Ow',
          name: 'Lofi Girl',
          avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&h=100&fit=crop',
          subscribers: '14.2M'
        },
        {
          id: 'UCqECaJ8Gagnn7YCbPEzWH6g',
          name: 'Taylor Swift',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          subscribers: '59.8M'
        }
      ];
    } catch {
      return [];
    }
  });

  // Watch Later
  const [watchLater, setWatchLater] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_watch_later')) || [CURATED_VIDEOS[2]];
    } catch {
      return [];
    }
  });

  // Watch History
  const [watchHistory, setWatchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('playtube_history')) || [CURATED_VIDEOS[0], CURATED_VIDEOS[1]];
    } catch {
      return [];
    }
  });

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null);

  // Voice Search Modal State
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Sync theme with DOM root
  useEffect(() => {
    localStorage.setItem('playtube_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Persist storage helpers
  useEffect(() => {
    localStorage.setItem('playtube_liked', JSON.stringify(likedVideos));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem('playtube_disliked', JSON.stringify(dislikedIds));
  }, [dislikedIds]);

  useEffect(() => {
    localStorage.setItem('playtube_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('playtube_watch_later', JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
    localStorage.setItem('playtube_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('playtube_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Helper functions
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addSearchQuery = (query) => {
    if (!query || !query.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.trim().toLowerCase());
      return [query.trim(), ...filtered].slice(0, 15);
    });
  };

  const removeSearchQuery = (query) => {
    setSearchHistory(prev => prev.filter(q => q !== query));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Search history cleared');
  };

  const toggleLikeVideo = (video) => {
    if (!video || !video.id) return;
    const isLiked = likedVideos.some(v => v.id === video.id);
    if (isLiked) {
      setLikedVideos(prev => prev.filter(v => v.id !== video.id));
      showToast('Removed from Liked videos');
    } else {
      setLikedVideos(prev => [video, ...prev.filter(v => v.id !== video.id)]);
      setDislikedIds(prev => prev.filter(id => id !== video.id));
      showToast('Added to Liked videos');
    }
  };

  const toggleDislikeVideo = (videoId) => {
    if (!videoId) return;
    const isDisliked = dislikedIds.includes(videoId);
    if (isDisliked) {
      setDislikedIds(prev => prev.filter(id => id !== videoId));
    } else {
      setDislikedIds(prev => [...prev, videoId]);
      setLikedVideos(prev => prev.filter(v => v.id !== videoId));
      showToast('Marked as not interested');
    }
  };

  const toggleSubscription = (channelData) => {
    if (!channelData || !channelData.name) return;
    const isSubscribed = subscriptions.some(s => s.name === channelData.name || s.id === channelData.id);
    if (isSubscribed) {
      setSubscriptions(prev => prev.filter(s => s.name !== channelData.name && s.id !== channelData.id));
      showToast(`Unsubscribed from ${channelData.name}`);
    } else {
      const newSub = {
        id: channelData.id || `sub_${Date.now()}`,
        name: channelData.name || channelData.channel,
        avatar: channelData.avatar || channelData.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${channelData.name}`,
        subscribers: channelData.subscribers || '1M'
      };
      setSubscriptions(prev => [newSub, ...prev]);
      showToast(`Subscribed to ${newSub.name}! 🔔`);
    }
  };

  const isSubscribed = (channelName) => {
    return subscriptions.some(s => s.name === channelName);
  };

  const isLiked = (videoId) => {
    return likedVideos.some(v => v.id === videoId);
  };

  const isDisliked = (videoId) => {
    return dislikedIds.includes(videoId);
  };

  const toggleWatchLater = (video) => {
    if (!video || !video.id) return;
    const exists = watchLater.some(v => v.id === video.id);
    if (exists) {
      setWatchLater(prev => prev.filter(v => v.id !== video.id));
      showToast('Removed from Watch Later');
    } else {
      setWatchLater(prev => [video, ...prev]);
      showToast('Saved to Watch Later');
    }
  };

  const isWatchLater = (videoId) => {
    return watchLater.some(v => v.id === videoId);
  };

  const addToHistory = (video) => {
    if (!video || !video.id) return;
    setWatchHistory(prev => {
      const filtered = prev.filter(v => v.id !== video.id);
      return [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
  };

  const removeFromHistory = (videoId) => {
    setWatchHistory(prev => prev.filter(v => v.id !== videoId));
    showToast('Removed from history');
  };

  const clearHistory = () => {
    setWatchHistory([]);
    showToast('Watch history cleared');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        activeCategory,
        setActiveCategory,
        searchHistory,
        addSearchQuery,
        removeSearchQuery,
        clearSearchHistory,
        likedVideos,
        toggleLikeVideo,
        isLiked,
        dislikedIds,
        toggleDislikeVideo,
        isDisliked,
        subscriptions,
        toggleSubscription,
        isSubscribed,
        watchLater,
        toggleWatchLater,
        isWatchLater,
        watchHistory,
        addToHistory,
        removeFromHistory,
        clearHistory,
        toastMessage,
        showToast,
        isVoiceModalOpen,
        setIsVoiceModalOpen
      }}
    >
      {children}
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#282828] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-[#3f3f3f] animate-bounce">
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
