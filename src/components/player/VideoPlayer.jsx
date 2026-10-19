import React, { useState } from 'react';
import {
  Tv,
  Sparkles,
  Settings2,
  Lightbulb
} from 'lucide-react';

export default function VideoPlayer({ videoId, title, isTheater, onToggleTheater }) {
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [quality, setQuality] = useState('1080p HD');
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [ambientLighting, setAmbientLighting] = useState(true);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400">
        No video selected
      </div>
    );
  }

  // Force 1080p Ultra HD and Ad-Free parameters
  const qualityParam = quality.includes('1080') ? 'hd1080' : quality.includes('720') ? 'hd720' : 'large';
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1&vq=${qualityParam}&hd=1&origin=${encodeURIComponent(origin)}`;

  const speeds = ['0.5', '0.75', '1', '1.25', '1.5', '2'];
  const qualities = ['1080p HD (60fps)', '720p HD', '480p SD', 'Auto (Enhanced)'];

  return (
    <div className="relative w-full group/player">
      {/* Ambient Cinema Lighting Glow (YouTube Ambient Mode) */}
      {ambientLighting && !isTheater && (
        <div className="absolute -inset-3 bg-gradient-to-r from-red-600/25 via-purple-600/20 to-rose-600/25 blur-3xl opacity-60 -z-10 transition-opacity duration-700 pointer-events-none rounded-3xl animate-pulse"></div>
      )}

      <div className={`relative w-full bg-black overflow-hidden shadow-2xl transition-all duration-300 border border-neutral-800/60 ${
        isTheater ? 'rounded-none border-x-0' : 'rounded-3xl'
      }`}>
        {/* 16:9 Aspect Video Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <iframe
            key={videoId + '-' + quality}
            src={embedUrl}
            title={title || 'PlayTube Video Player'}
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
          />

          {/* Sleek PlayTube Top Cinema Overlay Badge */}
          <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white shadow-xl opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            <span className="text-[11px] font-black tracking-wider text-neutral-100">PlayTube</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-600/20 px-1.5 py-0.5 rounded border border-red-500/30">
              {quality}
            </span>
          </div>

          {/* Corner Watermark Mask ensuring PlayTube branding */}
          <div className="absolute bottom-2.5 right-12 z-20 pointer-events-none hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md border border-neutral-700/60 text-white shadow text-[10px] font-bold opacity-0 group-hover/player:opacity-90 transition-opacity duration-300">
            <span className="text-red-500">Play</span>Tube Pro
          </div>
        </div>

        {/* Modern Player Action Bar (Ambient Toggle, Theater, Speed, Quality) */}
        <div className="bg-[#121212]/95 backdrop-blur-md px-3 sm:px-4 py-2.5 flex items-center justify-between border-t border-neutral-800 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 text-red-400 font-semibold text-[11px] border border-red-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Ad-Free High Fidelity
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline text-emerald-400 font-mono text-[11px] font-semibold">{quality}</span>
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Resolution Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu);
                  setShowSpeedMenu(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 transition text-[11px] font-medium border border-neutral-700"
                title="Video Quality"
              >
                <span>{quality.split(' ')[0]}</span>
              </button>

              {showQualityMenu && (
                <div className="absolute right-0 bottom-9 w-36 bg-[#282828] border border-neutral-700 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 backdrop-blur-md">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400">Resolution</div>
                  {qualities.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuality(q);
                        setShowQualityMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-700 transition ${
                        quality === q ? 'text-red-500 font-bold' : 'text-neutral-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Ambient Lighting Toggle */}
            <button
              onClick={() => setAmbientLighting(!ambientLighting)}
              className={`p-1.5 rounded-lg transition flex items-center gap-1 text-[11px] ${
                ambientLighting ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Ambient Mode Glow"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ambientLighting ? 'Ambient On' : 'Ambient Off'}</span>
            </button>

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 transition text-[11px] font-medium"
                title="Playback Speed"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 bottom-9 w-28 bg-[#282828] border border-neutral-700 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 backdrop-blur-md">
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
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition hidden md:flex items-center gap-1 text-[11px] font-medium"
              title={isTheater ? 'Exit theater mode' : 'Theater mode (T)'}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{isTheater ? 'Default' : 'Theater'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
