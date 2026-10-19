import React from 'react';
import { User, Moon, Sun, History, ThumbsUp, Clock, ShieldCheck, LogOut, Settings, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function UserAccountModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme, toggleTheme, showToast } = useApp();

  if (!isOpen) return null;

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="absolute right-0 top-12 w-72 bg-[#282828] dark:bg-[#282828] text-white rounded-2xl shadow-2xl border border-neutral-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* User Header */}
      <div className="p-4 border-b border-neutral-700 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-lg text-white shadow-md">
          P
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-sm text-neutral-100 truncate">PlayTube User</h4>
            <span className="p-0.5 rounded bg-red-600/30 text-red-400 text-[10px] font-bold">PRO</span>
          </div>
          <p className="text-xs text-neutral-400 truncate">@playtube_streamer</p>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> 100% Ad-Free Active
          </span>
        </div>
      </div>

      {/* Menu Links */}
      <div className="py-2 text-sm text-neutral-200">
        <button
          onClick={() => handleNav('/library')}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
        >
          <User className="w-4 h-4 text-neutral-400" />
          <span>Your Profile & Library</span>
        </button>

        <button
          onClick={() => handleNav('/history')}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
        >
          <History className="w-4 h-4 text-neutral-400" />
          <span>Watch History</span>
        </button>

        <button
          onClick={() => handleNav('/liked')}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
        >
          <ThumbsUp className="w-4 h-4 text-neutral-400" />
          <span>Liked Videos</span>
        </button>

        <button
          onClick={() => handleNav('/watch-later')}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
        >
          <Clock className="w-4 h-4 text-neutral-400" />
          <span>Watch Later</span>
        </button>

        <div className="h-px bg-neutral-700 my-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-neutral-700/60 transition"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Appearance: {theme === 'dark' ? 'Dark' : 'Light'}</span>
          </div>
          <span className="text-xs bg-neutral-700 px-2 py-0.5 rounded text-neutral-300">Toggle</span>
        </button>

        <button
          onClick={() => {
            onClose();
            showToast('Settings saved automatically to browser');
          }}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-neutral-700/60 transition"
        >
          <Settings className="w-4 h-4 text-neutral-400" />
          <span>Playback Settings</span>
        </button>

        <div className="h-px bg-neutral-700 my-1"></div>

        <button
          onClick={() => {
            onClose();
            showToast('Resetting session cache');
          }}
          className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-red-400 hover:bg-neutral-700/60 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch</span>
        </button>
      </div>
    </div>
  );
}
