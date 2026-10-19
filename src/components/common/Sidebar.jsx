import React from 'react';
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  FolderHeart,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Radio,
  Tv,
  Settings,
  HelpCircle,
  Film
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { sidebarOpen, subscriptions } = useApp();

  const mainLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Shorts', icon: Film, path: '/shorts' },
    { name: 'Subscriptions', icon: Tv, path: '/subscriptions' },
  ];

  const libraryLinks = [
    { name: 'You / Library', icon: FolderHeart, path: '/library' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Liked Videos', icon: ThumbsUp, path: '/liked' },
    { name: 'Watch Later', icon: Clock, path: '/watch-later' },
  ];

  const exploreLinks = [
    { name: 'Trending', icon: Flame, path: '/explore?cat=Trending' },
    { name: 'Music', icon: Music2, path: '/explore?cat=Music' },
    { name: 'Gaming', icon: Gamepad2, path: '/explore?cat=Gaming' },
    { name: 'News', icon: Newspaper, path: '/explore?cat=News' },
    { name: 'Live', icon: Radio, path: '/explore?cat=Live' },
  ];

  // Collapsed Mini-Sidebar Mode (YouTube compact style)
  if (!sidebarOpen) {
    return (
      <aside className="hidden md:flex flex-col items-center w-18 shrink-0 bg-white dark:bg-[#0f0f0f] py-3 px-1 space-y-4 border-r border-neutral-200 dark:border-neutral-800/60 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar select-none z-30 transition-colors duration-200">
        {[
          { name: 'Home', icon: Home, path: '/' },
          { name: 'Shorts', icon: Film, path: '/shorts' },
          { name: 'Subscriptions', icon: Tv, path: '/subscriptions' },
          { name: 'You', icon: FolderHeart, path: '/library' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 py-3 rounded-xl transition ${
                  isActive
                    ? 'text-neutral-900 bg-neutral-200/80 dark:text-white dark:bg-neutral-800 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </aside>
    );
  }

  // Expanded Full-Sidebar Mode
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white dark:bg-[#0f0f0f] p-3 border-r border-neutral-200 dark:border-neutral-800/60 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar select-none z-30 transition-colors duration-200">
      {/* Primary Links */}
      <div className="space-y-1 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? 'bg-neutral-200/80 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Library Section */}
      <div className="space-y-1 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <h4 className="px-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span>You</span>
        </h4>
        {libraryLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? 'bg-neutral-200/80 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Subscriptions Section */}
      <div className="space-y-1 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <h4 className="px-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
          Subscriptions
        </h4>
        {subscriptions.slice(0, 6).map((sub) => (
          <NavLink
            key={sub.id}
            to={`/search?q=${encodeURIComponent(sub.name)}`}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white transition group"
          >
            <img
              src={sub.avatar}
              alt={sub.name}
              className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-neutral-300 dark:ring-neutral-700 group-hover:ring-red-500"
            />
            <span className="truncate flex-1">{sub.name}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          </NavLink>
        ))}
      </div>

      {/* Explore Section */}
      <div className="space-y-1 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <h4 className="px-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
          Explore
        </h4>
        {exploreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-5 px-3 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? 'bg-neutral-200/80 text-neutral-900 dark:bg-neutral-800 dark:text-white font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 px-3 text-[11px] text-neutral-500 space-y-2">
        <p className="font-semibold text-neutral-600 dark:text-neutral-400">PlayTube Ad-Free Suite</p>
        <p>© 2026 PlayTube Inc. Powered by Free Reverse-Engineered APIs.</p>
      </div>
    </aside>
  );
}
