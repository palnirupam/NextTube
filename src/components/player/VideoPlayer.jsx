import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Tv,
  Settings,
  Lightbulb,
  RotateCcw,
  RotateCw,
  Check
} from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayer({ videoId, title, isTheater, onToggleTheater }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [quality, setQuality] = useState('1080p HD');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [ambientLighting, setAmbientLighting] = useState(true);
  const [centerRipple, setCenterRipple] = useState(null);
  const [hoverSeekTime, setHoverSeekTime] = useState(null);
  const [hoverSeekPos, setHoverSeekPos] = useState(0);

  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const seekbarRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isDraggingSeek = useRef(false);

  // Send command to YouTube Player (API or postMessage fallback)
  const sendCommand = useCallback((func, args = []) => {
    if (playerRef.current && typeof playerRef.current[func] === 'function') {
      try {
        playerRef.current[func](...args);
        return;
      } catch (e) {
        // fallback
      }
    }
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (e) {}
    }
  }, []);

  const triggerCenterRipple = useCallback((type) => {
    setCenterRipple(type);
    setTimeout(() => setCenterRipple(null), 500);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      sendCommand('pauseVideo');
      setIsPlaying(false);
      triggerCenterRipple('pause');
      setShowControls(true);
    } else {
      sendCommand('playVideo');
      setIsPlaying(true);
      triggerCenterRipple('play');
    }
  }, [isPlaying, sendCommand, triggerCenterRipple]);

  const seek = useCallback((time) => {
    const clamped = Math.max(0, Math.min(time, duration || 1000));
    setCurrentTime(clamped);
    sendCommand('seekTo', [clamped, true]);
  }, [duration, sendCommand]);

  const handleVolumeChange = useCallback((newVol) => {
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      sendCommand('mute');
    } else {
      setIsMuted(false);
      sendCommand('unMute');
      sendCommand('setVolume', [newVol]);
    }
  }, [sendCommand]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      sendCommand('unMute');
      sendCommand('setVolume', [volume || 100]);
    } else {
      setIsMuted(true);
      sendCommand('mute');
    }
  }, [isMuted, volume, sendCommand]);

  const setSpeed = useCallback((speed) => {
    setPlaybackSpeed(speed);
    sendCommand('setPlaybackRate', [parseFloat(speed)]);
    setShowSettingsMenu(false);
  }, [sendCommand]);

  const handleQualitySelect = useCallback((q) => {
    setQuality(q);
    const vq = q.includes('1080') ? 'hd1080' : q.includes('720') ? 'hd720' : 'large';
    try {
      sendCommand('setPlaybackQuality', [vq]);
    } catch {}
    setShowSettingsMenu(false);
  }, [sendCommand]);

  const toggleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  // Listen to fullscreenchange
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Mouse activity timer for auto-hiding controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimeoutRef.current);
    if (isPlaying && !showSettingsMenu) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying, showSettingsMenu]);

  // Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        onToggleTheater?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(Math.min(100, volume + 10));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(Math.max(0, volume - 10));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, onToggleTheater, seek, currentTime, handleVolumeChange, volume]);

  // Initialize YT API & attach player
  useEffect(() => {
    let isMounted = true;
    setCurrentTime(0);
    setIsPlaying(true);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
        return;
      } catch (e) {
        console.warn('loadVideoById fallback notice:', e);
      }
    }

    function attachPlayer() {
      if (!iframeRef.current || !window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onReady: (event) => {
              if (!isMounted) return;
              const dur = event.target.getDuration();
              if (dur && dur > 0) setDuration(dur);
              event.target.playVideo();
              try {
                event.target.setPlaybackQuality('hd1080');
              } catch {}
            },
            onStateChange: (event) => {
              if (!isMounted) return;
              if (event.data === 1) {
                // Playing
                setIsPlaying(true);
              } else if (event.data === 2) {
                // Paused
                setIsPlaying(false);
                setShowControls(true);
              } else if (event.data === 0) {
                // Ended
                setIsPlaying(false);
                setShowControls(true);
              }
            }
          }
        });
      } catch (err) {
        console.warn('YT Player init notice:', err);
      }
    }

    if (!window.YT) {
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      const prevHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevHandler) prevHandler();
        if (isMounted) attachPlayer();
      };
    } else {
      attachPlayer();
    }

    // Interval to track currentTime & duration smoothly
    const interval = setInterval(() => {
      if (!isDraggingSeek.current && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const curr = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (typeof curr === 'number' && !isNaN(curr)) {
            setCurrentTime(curr);
          }
          if (typeof dur === 'number' && dur > 0 && !isNaN(dur)) {
            setDuration(dur);
          }
        } catch {}
      }
    }, 250);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [videoId]);

  // Seekbar interaction handlers
  const handleSeekbarClick = (e) => {
    if (!seekbarRef.current || !duration) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pos * duration);
  };

  const handleSeekbarMouseMove = (e) => {
    if (!seekbarRef.current || !duration) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekPos(pos * 100);
    setHoverSeekTime(pos * duration);
  };

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-neutral-900 rounded-3xl flex items-center justify-center text-neutral-400">
        No video selected
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  // controls=0 completely suppresses YouTube's native bottom bar, YouTube logo, and "More videos" popup!
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;

  const speeds = ['0.5', '0.75', '1', '1.25', '1.5', '2'];
  const qualities = ['1080p HD (60fps)', '720p HD', '480p SD', 'Auto'];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying && !showSettingsMenu) setShowControls(false);
      }}
      className={`relative w-full group/player select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center rounded-none' : ''
      }`}
    >
      {/* Ambient Cinema Lighting Glow (Ambient Mode) */}
      {ambientLighting && !isTheater && !isFullscreen && (
        <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-purple-600/15 to-rose-600/20 blur-3xl opacity-60 -z-10 pointer-events-none rounded-3xl"></div>
      )}

      <div className={`relative w-full bg-black overflow-hidden shadow-2xl transition-all duration-300 ${
        isTheater || isFullscreen ? 'rounded-none border-0' : 'rounded-3xl border border-neutral-800/80'
      }`}>
        {/* 16:9 Video Canvas (Overscan 114% to push out YouTube watermark and native overlay links) */}
        <div className={`relative w-full bg-black overflow-hidden ${isFullscreen ? 'h-screen' : 'aspect-video'}`}>
          <iframe
            ref={iframeRef}
            id={`yt-player-${videoId}`}
            src={embedUrl}
            title={title || 'PlayTube Video Player'}
            referrerPolicy="origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            className="w-[114%] h-[114%] -left-[7%] -top-[7%] border-0 absolute pointer-events-none"
          />

          {/* Click Overlay (Play / Pause & Double-Click Fullscreen) */}
          <div
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            className="absolute inset-0 z-10 cursor-pointer"
          />

          {/* Center Play/Pause Ripple Indicator */}
          {centerRipple && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center animate-ping duration-300">
                {centerRipple === 'play' ? (
                  <Play className="w-8 h-8 ml-1 fill-white" />
                ) : (
                  <Pause className="w-8 h-8 fill-white" />
                )}
              </div>
            </div>
          )}

          {/* Custom Sleek Bottom Controls Bar (Zero YouTube Logo, Pixel-Perfect YouTube Style) */}
          <div
            className={`absolute inset-x-0 bottom-0 z-30 pt-16 pb-3 px-3 sm:px-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 pointer-events-auto ${
              showControls || !isPlaying || showSettingsMenu
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Interactive Red YouTube Seekbar */}
            <div
              ref={seekbarRef}
              onClick={handleSeekbarClick}
              onMouseMove={handleSeekbarMouseMove}
              onMouseLeave={() => setHoverSeekTime(null)}
              className="w-full h-1.5 hover:h-2.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer relative mb-3 transition-all group/seek"
            >
              {/* Hover Position Preview Line */}
              {hoverSeekTime !== null && (
                <div
                  className="absolute top-0 bottom-0 bg-white/40 rounded-full pointer-events-none"
                  style={{ width: `${hoverSeekPos}%` }}
                />
              )}

              {/* Red Played Progress */}
              <div
                className="h-full bg-red-600 rounded-full relative pointer-events-none transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Drag Scrubber Thumb */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow-md scale-0 group-hover/seek:scale-100 transition-transform" />
              </div>

              {/* Hover Time Tooltip */}
              {hoverSeekTime !== null && (
                <div
                  className="absolute -top-7 px-2 py-0.5 rounded bg-neutral-900/90 text-white text-[11px] font-mono border border-neutral-700 pointer-events-none transform -translate-x-1/2 shadow-lg"
                  style={{ left: `${hoverSeekPos}%` }}
                >
                  {formatTime(hoverSeekTime)}
                </div>
              )}
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              {/* Left Group: Play/Pause, Replay 10s, Volume, Time */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:text-red-500 transition active:scale-90"
                  title={isPlaying ? 'Pause (k)' : 'Play (k)'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => seek(currentTime - 10)}
                  className="p-1.5 text-neutral-300 hover:text-white transition active:scale-90 hidden sm:block"
                  title="Rewind 10s (Left Arrow)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => seek(currentTime + 10)}
                  className="p-1.5 text-neutral-300 hover:text-white transition active:scale-90 hidden sm:block"
                  title="Forward 10s (Right Arrow)"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume Slider */}
                <div className="flex items-center gap-1 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 hover:text-red-400 transition"
                    title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-red-500" />
                    ) : volume < 50 ? (
                      <Volume1 className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <div className="w-0 group-hover/vol:w-16 sm:group-hover/vol:w-20 transition-all duration-200 overflow-hidden flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value, 10))}
                      className="w-16 sm:w-20 accent-red-600 cursor-pointer h-1 rounded-lg shrink-0"
                    />
                  </div>
                </div>

                {/* Time Display */}
                <div className="text-[12px] font-mono text-neutral-300">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-neutral-500 mx-1.5">/</span>
                  <span className="text-neutral-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right Group: Settings, Ambient, Theater, Fullscreen */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 relative">
                {/* Settings Menu (Speed & Quality) */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className="p-1.5 text-neutral-300 hover:text-white transition hover:rotate-45"
                    title="Playback Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  {showSettingsMenu && (
                    <div className="absolute right-0 bottom-10 w-48 bg-[#1f1f1f]/95 backdrop-blur-md border border-neutral-700/80 rounded-2xl shadow-2xl py-2 z-40 text-xs animate-in fade-in zoom-in-95">
                      {/* Speed Section */}
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                        Playback Speed
                      </div>
                      <div className="py-1">
                        {speeds.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSpeed(s)}
                            className={`w-full px-3.5 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 transition ${
                              playbackSpeed === s ? 'text-red-500 font-bold' : 'text-neutral-300'
                            }`}
                          >
                            <span>{s === '1' ? 'Normal (1x)' : `${s}x`}</span>
                            {playbackSpeed === s && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>

                      {/* Quality Section */}
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-t border-b border-neutral-800 mt-1">
                        Resolution
                      </div>
                      <div className="py-1">
                        {qualities.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualitySelect(q)}
                            className={`w-full px-3.5 py-1.5 text-left flex items-center justify-between hover:bg-neutral-800 transition ${
                              quality === q ? 'text-red-500 font-bold' : 'text-neutral-300'
                            }`}
                          >
                            <span>{q}</span>
                            {quality === q && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ambient Mode Toggle */}
                {!isFullscreen && (
                  <button
                    onClick={() => setAmbientLighting(!ambientLighting)}
                    className={`p-1.5 transition rounded-lg ${
                      ambientLighting ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                    }`}
                    title={ambientLighting ? 'Ambient Mode On' : 'Ambient Mode Off'}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                )}

                {/* Theater Mode Toggle */}
                {!isFullscreen && (
                  <button
                    onClick={onToggleTheater}
                    className="p-1.5 text-neutral-300 hover:text-white transition hidden md:block"
                    title={isTheater ? 'Default view (t)' : 'Theater mode (t)'}
                  >
                    <Tv className="w-4 h-4" />
                  </button>
                )}

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 text-neutral-300 hover:text-white transition active:scale-90"
                  title={isFullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
