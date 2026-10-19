import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Mic,
  Bell,
  Sun,
  Moon,
  X,
  History,
  TrendingUp,
  PlaySquare,
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getSearchSuggestions } from '../../services/api';
import NotificationDropdown from './NotificationDropdown';
import UserAccountModal from './UserAccountModal';

export default function Navbar() {
  const {
    toggleSidebar,
    theme,
    toggleTheme,
    searchHistory,
    addSearchQuery,
    removeSearchQuery,
    setIsVoiceModalOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  const searchBoxRef = useRef(null);
  const navigate = useNavigate();

  // Fetch suggestions as query changes
  useEffect(() => {
    let active = true;
    if (query.trim()) {
      getSearchSuggestions(query).then((items) => {
        if (active) setSuggestions(items);
      });
    } else {
      setSuggestions([]);
    }
    return () => {
      active = false;
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    addSearchQuery(query);
    setIsFocused(false);
    setIsMobileSearchActive(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (text) => {
    setQuery(text);
    addSearchQuery(text);
    setIsFocused(false);
    setIsMobileSearchActive(false);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#0f0f0f] dark:bg-[#0f0f0f] bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between border-b border-neutral-800/80 safe-top">
      {/* Mobile Search Overlay */}
      {isMobileSearchActive ? (
        <div className="absolute inset-0 z-50 bg-[#0f0f0f] flex items-center px-2 gap-2">
          <button
            onClick={() => setIsMobileSearchActive(false)}
            className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <form onSubmit={handleSearch} className="flex-1 flex items-center bg-[#121212] border border-neutral-700 rounded-full overflow-hidden">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PlayTube..."
              className="w-full bg-transparent px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="px-4 py-2 bg-neutral-800 text-neutral-300 border-l border-neutral-700">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchActive(false);
              setIsVoiceModalOpen(true);
            }}
            className="p-2.5 rounded-full bg-neutral-800 text-neutral-200"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      ) : null}

      {/* Left: Hamburger Menu & Brand Logo */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition hidden md:flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-1.5 group select-none">
          <div className="relative flex items-center justify-center">
            {/* YouTube style Red Play Badge */}
            <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-0 h-0 border-y-[4.5px] border-y-transparent border-l-[8px] border-l-white ml-0.5" />
            </div>
          </div>
          <div className="flex items-center tracking-tighter">
            <span className="font-extrabold text-lg sm:text-xl text-neutral-100 font-sans tracking-tight">Play</span>
            <span className="font-bold text-lg sm:text-xl text-red-500 font-sans tracking-tight">Tube</span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest ml-1 bg-neutral-800/80 px-1 py-0.5 rounded border border-neutral-700/50">
              PRO
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Smart Search Bar (Desktop & Tablet) */}
      <div ref={searchBoxRef} className="hidden sm:flex items-center flex-1 max-w-xl mx-4 relative">
        <form onSubmit={handleSearch} className="flex w-full items-center">
          <div className={`flex items-center flex-1 bg-[#121212] border rounded-l-full overflow-hidden transition-all ${
            isFocused ? 'border-blue-500 shadow-inner' : 'border-neutral-700 hover:border-neutral-600'
          }`}>
            {isFocused && (
              <Search className="w-4 h-4 ml-4 text-neutral-400 shrink-0" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search (e.g. Arijit Singh, Taylor Swift, Lo-fi, React)..."
              className={`w-full bg-transparent py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none ${
                isFocused ? 'px-3' : 'px-4'
              }`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1.5 mr-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            title="Search"
            className="h-10 px-6 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-200 border border-l-0 border-neutral-700 rounded-r-full flex items-center justify-center transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Voice Search Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Search with your voice"
          className="ml-3 p-2.5 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-neutral-200 border border-neutral-700/60 transition shrink-0 hover:scale-105"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Search Suggestions & Recent History Dropdown */}
        {isFocused && (
          <div className="absolute top-12 left-0 right-12 bg-[#212121] border border-neutral-700 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden animate-in fade-in duration-150">
            {/* Live Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-2">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleSelectSuggestion(item)}
                    className="flex items-center px-4 py-2 hover:bg-neutral-700/60 cursor-pointer text-sm text-neutral-200 gap-3 group"
                  >
                    <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div>
                <div className="px-4 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Recent searches</span>
                </div>
                {searchHistory.slice(0, 5).map((historyItem, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => handleSelectSuggestion(historyItem)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-neutral-700/60 cursor-pointer text-sm text-neutral-300 gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <History className="w-4 h-4 text-neutral-400 group-hover:text-purple-400" />
                      <span className="truncate">{historyItem}</span>
                    </div>
                    <button
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeSearchQuery(historyItem);
                      }}
                      className="text-neutral-500 hover:text-red-400 p-1 rounded transition"
                      title="Remove from history"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Theme Toggle, Notification & User Avatar */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Mobile Search Icon */}
        <button
          onClick={() => setIsMobileSearchActive(true)}
          className="sm:hidden p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Mobile Voice Mic */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="sm:hidden p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
          title="Voice Search"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-neutral-300" />
          )}
        </button>

        {/* Notifications Icon with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserOpen(false);
            }}
            className="p-2 text-neutral-300 hover:text-white rounded-full hover:bg-neutral-800 transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Account Avatar with Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setIsUserOpen(!isUserOpen);
              setIsNotifOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-md ring-2 ring-transparent hover:ring-red-500 transition cursor-pointer"
            title="Your Profile"
          >
            P
          </button>
          <UserAccountModal isOpen={isUserOpen} onClose={() => setIsUserOpen(false)} />
        </div>
      </div>
    </header>
  );
}
