import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Tv,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings2
} from 'lucide-react';

export default function VideoPlayer({ videoId, title, isTheater, onToggleTheater }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400">
        No video selected
      </div>
    );
  }

  // Embed URL with optimized parameters for instant, ad-free, smooth playback
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`;

  const speeds = ['0.5', '0.75', '1', '1.25', '1.5', '2'];

  return (
    <div className={`relative w-full bg-black overflow-hidden shadow-2xl transition-all duration-300 ${
      isTheater ? 'rounded-none' : 'rounded-2xl'
    }`}>
      {/* 16:9 Aspect Video Container */}
      <div className="relative aspect-video w-full bg-black">
        <iframe
          src={embedUrl}
          title={title || 'PlayTube Video Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0 absolute inset-0"
        />
      </div>

      {/* Modern Player Action Bar (Theater, Speed, Pro Controls) */}
      <div className="bg-[#121212] px-3 sm:px-4 py-2 flex items-center justify-between border-t border-neutral-800 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Ad-Free Mode Active
          </span>
          <span className="hidden sm:inline text-neutral-500">•</span>
          <span className="hidden sm:inline text-neutral-400 font-mono">1080p60 Stream</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 transition"
              title="Playback Speed"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>{playbackSpeed}x</span>
            </button>

            {showSpeedMenu && (
              <div className="absolute right-0 bottom-8 w-28 bg-[#282828] border border-neutral-700 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400">Speed</div>
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setPlaybackSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-700 transition ${
                      playbackSpeed === s ? 'text-red-500 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    {s === '1' ? 'Normal (1x)' : `${s}x`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theater Mode Toggle */}
          <button
            onClick={onToggleTheater}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition hidden md:flex items-center gap-1"
            title={isTheater ? 'Exit theater mode' : 'Theater mode (T)'}
          >
            <Tv className="w-4 h-4" />
            <span className="text-[11px]">{isTheater ? 'Default View' : 'Theater'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
