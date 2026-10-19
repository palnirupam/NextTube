import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import MobileBottomNav from './components/common/MobileBottomNav';
import VoiceSearchModal from './components/common/VoiceSearchModal';

import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import ShortsPage from './pages/ShortsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import LikedVideosPage from './pages/LikedVideosPage';
import WatchLaterPage from './pages/WatchLaterPage';
import SearchPage from './pages/SearchPage';
import ExplorePage from './pages/ExplorePage';
import ChannelPage from './pages/ChannelPage';

function AppContent() {
  const { isVoiceModalOpen, setIsVoiceModalOpen } = useApp();
  const location = useLocation();

  // On WatchPage and ShortsPage, sidebar is hidden by default for maximum cinema viewing experience
  const isWatchPage = location.pathname.startsWith('/watch');
  const isShortsPage = location.pathname.startsWith('/shorts');
  const hideSidebar = isWatchPage || isShortsPage;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0f0f0f] text-neutral-900 dark:text-[#f1f1f1] flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white transition-colors duration-200">
      {/* Top YouTube Header - Hidden on Shorts for full-screen immersive reel experience */}
      {!isShortsPage && <Navbar />}

      {/* Center Layout Container: Sidebar + Main Router Body */}
      <div className="flex flex-1 w-full overflow-hidden">
        {!hideSidebar && <Sidebar />}

        <div className={`flex-1 flex flex-col min-w-0 ${isShortsPage ? 'overflow-hidden h-[calc(100dvh-3.5rem)]' : 'overflow-y-auto'}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch" element={<WatchPage />} />
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/liked" element={<LikedVideosPage />} />
            <Route path="/watch-later" element={<WatchLaterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Official YouTube Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Voice Search Dialog */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
