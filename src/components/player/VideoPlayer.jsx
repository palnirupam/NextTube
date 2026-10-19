import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
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

export default function VideoPlayer({ videoId, title, isTheater, onToggleTheater, onEnded }) {
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

  // Send command to YouTube Player (Both YT.Player API & direct postMessage)
  const sendCommand = useCallback((func, args = []) => {
    // 1. Try player instance
    if (playerRef.current && typeof playerRef.current[func] === 'function') {
      try {
        playerRef.current[func](...args);
      } catch (e) {}
    }
    // 2. Guaranteed direct postMessage to iframe window
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
    setTimeout(() => setCenterRipple(null), 600);
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
    const targetDur = duration > 0 ? duration : 3600;
    const clamped = Math.max(0, Math.min(time, targetDur));
    setCurrentTime(clamped);

    // Call seekTo on player instance
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(clamped, true);
      } catch (e) {}
    }

    // Also send postMessage seek command directly
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [clamped, true] }),
          '*'
        );
      } catch (e) {}
    }
  }, [duration]);

  const handleRewind10 = useCallback(() => {
    const target = Math.max(0, currentTime - 10);
    seek(target);
    triggerCenterRipple('rewind');
  }, [currentTime, seek, triggerCenterRipple]);

  const handleForward10 = useCallback(() => {
    const targetDur = duration > 0 ? duration : currentTime + 60;
    const target = Math.min(targetDur, currentTime + 10);
    seek(target);
    triggerCenterRipple('forward');
  }, [currentTime, duration, seek, triggerCenterRipple]);

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

  // Auto-hide controls timer
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimeoutRef.current);
    if (isPlaying && !showSettingsMenu) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying, showSettingsMenu]);

  // Keyboard Shortcuts (Space, k, j, l, f, m, t, 0-9)
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
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleForward10();
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        handleRewind10();
      } else if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        if (duration > 0) {
          const pct = parseInt(e.key, 10) / 10;
          seek(pct * duration);
        }
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
  }, [togglePlay, toggleFullscreen, toggleMute, onToggleTheater, seek, currentTime, handleForward10, handleRewind10, duration, handleVolumeChange, volume]);

  // Direct HTML5 postMessage listener for real-time video time and state
  useEffect(() => {
    function handlePostMessage(event) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // infoDelivery event carries real-time currentTime, duration, and playerState
        if (data.event === 'infoDelivery' && data.info) {
          if (!isDraggingSeek.current && typeof data.info.currentTime === 'number') {
            setCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            if (data.info.playerState === 1) setIsPlaying(true);
            else if (data.info.playerState === 2) setIsPlaying(false);
            else if (data.info.playerState === 0) {
              setIsPlaying(false);
              onEnded?.();
            }
          }
        } else if (data.event === 'initialDelivery' && data.info) {
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setDuration(data.info.duration);
          }
        }
      } catch {}
    }

    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, [onEnded]);

  // Attach YouTube Player API and initialize
  const attachPlayer = useCallback(() => {
    if (!iframeRef.current || !window.YT || !window.YT.Player) return;

    try {
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            const dur = event.target.getDuration?.();
            if (dur && dur > 0) setDuration(dur);
            event.target.playVideo?.();
          },
          onStateChange: (event) => {
            if (event.data === 1) {
              setIsPlaying(true);
              const dur = event.target.getDuration?.();
              if (dur && dur > 0) setDuration(dur);
            } else if (event.data === 2) {
              setIsPlaying(false);
              setShowControls(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
              setShowControls(true);
              onEnded?.();
            }
          }
        }
      });
    } catch (err) {
      console.warn('YT Player attach notice:', err);
    }
  }, [onEnded]);

  // Load YouTube IFrame API script once
  useEffect(() => {
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
        attachPlayer();
      };
    } else {
      attachPlayer();
    }
  }, [attachPlayer]);

  // Permanent Uninterrupted Polling Timer: Never killed by videoId changes
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. If playerRef is alive and has API methods
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

      // 2. Send "listening" handshake to ensure iframe continues delivering state
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
        } catch {}
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // When videoId changes, smoothly update
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('loadVideoById fallback notice:', e);
      }
    }
  }, [videoId]);

  // Iframe onLoad handler - immediately greets the YouTube player
  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
      } catch (e) {}
    }
    attachPlayer();
  };

  // Helper to calculate time from click/touch coordinates
  const calculateSeekTime = useCallback((clientX) => {
    if (!seekbarRef.current) return { pos: 0, time: 0 };
    const rect = seekbarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetDur = duration > 0 ? duration : 180;
    return { pos, time: pos * targetDur };
  }, [duration]);

  // Click on seekbar
  const handleSeekbarClick = (e) => {
    const { time } = calculateSeekTime(e.clientX);
    seek(time);
  };

  // Drag seekbar with mouse
  const handleSeekMouseDown = (e) => {
    isDraggingSeek.current = true;
    const { time } = calculateSeekTime(e.clientX);
    setCurrentTime(time);

    const onMouseMove = (moveEvent) => {
      const { time: dragTime, pos } = calculateSeekTime(moveEvent.clientX);
      setCurrentTime(dragTime);
      setHoverSeekPos(pos * 100);
      setHoverSeekTime(dragTime);
    };

    const onMouseUp = (upEvent) => {
      isDraggingSeek.current = false;
      const { time: finalTime } = calculateSeekTime(upEvent.clientX);
      seek(finalTime);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Drag seekbar with touch on mobile/tablets
  const handleSeekTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    isDraggingSeek.current = true;
    const { time } = calculateSeekTime(e.touches[0].clientX);
    setCurrentTime(time);

    const onTouchMove = (moveEvent) => {
      if (!moveEvent.touches || !moveEvent.touches[0]) return;
      const { time: dragTime, pos } = calculateSeekTime(moveEvent.touches[0].clientX);
      setCurrentTime(dragTime);
      setHoverSeekPos(pos * 100);
      setHoverSeekTime(dragTime);
    };

    const onTouchEnd = (endEvent) => {
      isDraggingSeek.current = false;
      const clientX = endEvent.changedTouches?.[0]?.clientX ?? e.touches[0].clientX;
      const { time: finalTime } = calculateSeekTime(clientX);
      seek(finalTime);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  const handleSeekbarMouseMove = (e) => {
    const { pos, time } = calculateSeekTime(e.clientX);
    setHoverSeekPos(pos * 100);
    setHoverSeekTime(time);
  };

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-neutral-900 rounded-3xl flex items-center justify-center text-neutral-400">
        No video selected
      </div>
    );
  }

  const isNative = Capacitor.isNativePlatform();
  // Use youtube-nocookie.com to completely bypass domain origin restrictions & error 150
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&enablejsapi=1${isNative ? '' : `&origin=${encodeURIComponent(window.location.origin)}`}`;

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
        {/* 16:9 Video Canvas (100% Full View, Zero Cropping, Responsive on all Android devices) */}
        <div className={`relative w-full bg-black overflow-hidden ${isFullscreen ? 'h-screen' : 'aspect-video min-h-[210px] sm:min-h-[340px]'}`}>
          <iframe
            ref={iframeRef}
            id={`yt-player-${videoId}`}
            src={embedUrl}
            title={title || 'PlayTube Video Player'}
            referrerPolicy="no-referrer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
            className="w-full h-full border-0 absolute inset-0 pointer-events-none"
          />

          {/* Click Overlay (Play / Pause & Double-Click Fullscreen) */}
          <div
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            className="absolute inset-0 z-10 cursor-pointer"
          />

          {/* Big Center Play Button when paused or waiting to play */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group/centerplay transition-all duration-200"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover/centerplay:scale-110 active:scale-95">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
              </div>
            </div>
          )}

          {/* Center Play/Pause & Seek Ripple Indicators */}
          {centerRipple && (
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              <div className="w-18 h-18 rounded-full bg-black/75 backdrop-blur-md text-white flex flex-col items-center justify-center animate-ping duration-300 shadow-2xl">
                {centerRipple === 'play' && <Play className="w-9 h-9 ml-1 fill-white" />}
                {centerRipple === 'pause' && <Pause className="w-9 h-9 fill-white" />}
                {centerRipple === 'rewind' && (
                  <div className="flex flex-col items-center">
                    <RotateCcw className="w-7 h-7 text-white" />
                    <span className="text-[10px] font-bold mt-0.5">-10s</span>
                  </div>
                )}
                {centerRipple === 'forward' && (
                  <div className="flex flex-col items-center">
                    <RotateCw className="w-7 h-7 text-white" />
                    <span className="text-[10px] font-bold mt-0.5">+10s</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Sleek Bottom Controls Bar */}
          <div
            className={`absolute inset-x-0 bottom-0 z-30 pt-16 pb-3 px-3 sm:px-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 pointer-events-auto ${
              showControls || !isPlaying || showSettingsMenu
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Interactive Red YouTube Seekbar with Drag & Touch Support */}
            <div
              ref={seekbarRef}
              onClick={handleSeekbarClick}
              onMouseDown={handleSeekMouseDown}
              onTouchStart={handleSeekTouchStart}
              onMouseMove={handleSeekbarMouseMove}
              onMouseLeave={() => setHoverSeekTime(null)}
              className="w-full h-2 hover:h-3 py-1 cursor-pointer relative mb-3 transition-all group/seek flex items-center"
            >
              {/* Seekbar Background Track */}
              <div className="w-full h-1 group-hover/seek:h-1.5 bg-white/20 group-hover/seek:bg-white/30 rounded-full relative transition-all">
                {/* Hover Position Preview Line */}
                {hoverSeekTime !== null && (
                  <div
                    className="absolute top-0 bottom-0 bg-white/40 rounded-full pointer-events-none"
                    style={{ width: `${hoverSeekPos}%` }}
                  />
                )}

                {/* Red Played Progress Line */}
                <div
                  className="h-full bg-red-600 rounded-full relative pointer-events-none transition-all duration-75"
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Drag Scrubber Thumb */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-red-600 rounded-full shadow-lg scale-0 group-hover/seek:scale-100 transition-transform ring-2 ring-white/30" />
                </div>
              </div>

              {/* Hover Time Tooltip */}
              {hoverSeekTime !== null && (
                <div
                  className="absolute -top-7 px-2 py-0.5 rounded-lg bg-neutral-900/95 text-white text-[11px] font-mono border border-neutral-700 pointer-events-none transform -translate-x-1/2 shadow-xl"
                  style={{ left: `${hoverSeekPos}%` }}
                >
                  {formatTime(hoverSeekTime)}
                </div>
              )}
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              {/* Left Group: Play/Pause, Rewind 10s, Forward 10s, Volume, Time */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                {/* Play / Pause Button */}
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

                {/* Rewind 10s Button - Visible on all devices! */}
                <button
                  onClick={handleRewind10}
                  className="p-1.5 text-neutral-300 hover:text-white transition active:scale-90 flex items-center justify-center"
                  title="Rewind 10s (j / Left Arrow)"
                >
                  <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Forward 10s Button - Visible on all devices! */}
                <button
                  onClick={handleForward10}
                  className="p-1.5 text-neutral-300 hover:text-white transition active:scale-90 flex items-center justify-center"
                  title="Forward 10s (l / Right Arrow)"
                >
                  <RotateCw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
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
                <div className="text-[11px] sm:text-[12px] font-mono text-neutral-300 ml-1">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-neutral-500 mx-1">/</span>
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
