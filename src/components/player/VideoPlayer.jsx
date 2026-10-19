import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  Maximize,
  Minimize,
  Tv,
  Lightbulb,
  Sparkles,
  Download,
  Info
} from 'lucide-react';

export default function VideoPlayer({
  videoId,
  title,
  channel,
  isTheater,
  onToggleTheater,
  onEnded,
  onDownload
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientLighting, setAmbientLighting] = useState(true);
  const [showQualityTip, setShowQualityTip] = useState(false);

  const wrapperRef = useRef(null);
  const iframeRef = useRef(null);
  const silentAudioRef = useRef(null);
  const isPlayingRef = useRef(true);
  const userPausedRef = useRef(false);

  // Fullscreen toggle supporting standard & webkit
  const toggleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFs) {
      if (wrapperRef.current.requestFullscreen) {
        wrapperRef.current.requestFullscreen().catch(() => {});
      } else if (wrapperRef.current.webkitRequestFullscreen) {
        wrapperRef.current.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, []);

  // Listen to fullscreen changes across all browsers & webviews
  useEffect(() => {
    const onFsChange = () => {
      const fs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(fs);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Keyboard shortcut for fullscreen (f) and theater (t)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        onToggleTheater?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, onToggleTheater]);

  const playSilentAudio = useCallback(() => {
    try {
      if (!silentAudioRef.current) {
        // Continuous silent WAV audio element to guarantee Android AudioFocus & prevent WebView suspend
        const audio = new Audio('data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==');
        audio.loop = true;
        audio.volume = 0.001;
        silentAudioRef.current = audio;
      }
      silentAudioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  const pauseSilentAudio = useCallback(() => {
    try {
      silentAudioRef.current?.pause();
    } catch {}
  }, []);

  const sendIframeCommand = useCallback((command) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    }
  }, []);

  // Sync with native Android Foreground Service & manage background screen-off playback
  useEffect(() => {
    isPlayingRef.current = true;
    userPausedRef.current = false;
    playSilentAudio();

    if (window.PlayTubeNative?.onVideoStarted) {
      window.PlayTubeNative.onVideoStarted(title || 'PlayTube Stream', channel || 'PlayTube Background Player');
    }

    const handleScreenLockOrBlur = () => {
      // If user did not explicitly press pause and screen locked or blurred, keep playing
      if (isPlayingRef.current && !userPausedRef.current) {
        playSilentAudio();
        setTimeout(() => sendIframeCommand('playVideo'), 150);
        setTimeout(() => sendIframeCommand('playVideo'), 500);
      }
    };

    window.addEventListener('blur', handleScreenLockOrBlur);
    window.addEventListener('playtube_background_lock', handleScreenLockOrBlur);
    document.addEventListener('visibilitychange', handleScreenLockOrBlur);

    return () => {
      window.removeEventListener('blur', handleScreenLockOrBlur);
      window.removeEventListener('playtube_background_lock', handleScreenLockOrBlur);
      document.removeEventListener('visibilitychange', handleScreenLockOrBlur);
      pauseSilentAudio();
      window.PlayTubeNative?.onVideoStopped?.();
    };
  }, [videoId, title, channel, playSilentAudio, pauseSilentAudio, sendIframeCommand]);

  // Listen for iframe state events (autoplay, background state change, ended)
  useEffect(() => {
    const handlePostMessage = (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // Video ended -> trigger autoplay next
        if (data.event === 'infoDelivery' && data.info?.playerState === 0) {
          isPlayingRef.current = false;
          window.PlayTubeNative?.onVideoStopped?.();
          onEnded?.();
          return;
        }

        // State changes: 1 = playing, 2 = paused
        if (data.event === 'infoDelivery' && typeof data.info?.playerState === 'number') {
          const state = data.info.playerState;
          if (state === 1) {
            isPlayingRef.current = true;
            userPausedRef.current = false;
            playSilentAudio();
            window.PlayTubeNative?.onVideoStarted?.(title || 'PlayTube Stream', channel || 'PlayTube Background Player');
          } else if (state === 2) {
            // Auto-paused by OS screen lock or blur while user didn't request pause -> resume!
            if (!userPausedRef.current && (document.hidden || !document.hasFocus())) {
              playSilentAudio();
              setTimeout(() => sendIframeCommand('playVideo'), 100);
            }
          }
        }
      } catch {}
    };
    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, [onEnded, title, channel, playSilentAudio, sendIframeCommand]);

  // Screen-Off & Lock-Screen Media Session Integration (YouTube Premium Feature)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator && title && videoId) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: title || 'PlayTube Stream',
          artist: channel || 'PlayTube Background Player',
          album: 'PlayTube Screen-Off Streaming',
          artwork: [
            { src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' },
            { src: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`, sizes: '320x180', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.playbackState = 'playing';

        navigator.mediaSession.setActionHandler('play', () => {
          userPausedRef.current = false;
          isPlayingRef.current = true;
          playSilentAudio();
          sendIframeCommand('playVideo');
          window.PlayTubeNative?.onVideoStarted?.(title, channel);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          userPausedRef.current = true;
          isPlayingRef.current = false;
          pauseSilentAudio();
          sendIframeCommand('pauseVideo');
          window.PlayTubeNative?.onVideoPaused?.();
        });

        navigator.mediaSession.setActionHandler('stop', () => {
          userPausedRef.current = true;
          isPlayingRef.current = false;
          pauseSilentAudio();
          sendIframeCommand('stopVideo');
          window.PlayTubeNative?.onVideoStopped?.();
        });
      } catch (e) {
        console.warn('MediaSession notice:', e);
      }
    }
  }, [videoId, title, channel, playSilentAudio, pauseSilentAudio, sendIframeCommand]);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400">
        No video selected
      </div>
    );
  }

  // Use official youtube.com embed with playsinline, controls=1 and vq=hd1080 for HD streaming
  // Omit origin query to prevent YouTube origin mismatch errors on Vercel & mobile webviews
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&playsinline=1&enablejsapi=1&vq=hd1080`;

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-black flex items-center justify-center rounded-none w-screen h-screen'
          : ''
      }`}
    >
      {/* Ambient Cinema Lighting Glow */}
      {ambientLighting && !isTheater && !isFullscreen && (
        <div className="absolute -inset-4 bg-gradient-to-r from-red-600/25 via-purple-600/20 to-blue-600/25 blur-3xl opacity-70 -z-10 pointer-events-none rounded-3xl" />
      )}

      {/* Video Container */}
      <div
        className={`relative w-full bg-black overflow-hidden shadow-2xl transition-all duration-300 ${
          isTheater || isFullscreen
            ? 'rounded-none border-0'
            : 'rounded-2xl sm:rounded-3xl border border-neutral-800/80'
        }`}
      >
        {/* 16:9 Canvas (Zero stretching, true HD pixel clarity) */}
        <div
          className={`relative w-full bg-black ${
            isFullscreen
              ? 'h-screen w-screen flex items-center justify-center'
              : 'aspect-video min-h-[210px] sm:min-h-[360px]'
          }`}
        >
          <iframe
            ref={iframeRef}
            id={`yt-player-${videoId}`}
            src={embedUrl}
            title={title || 'PlayTube Video Player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        </div>
      </div>

      {/* Sleek PlayTube Player Action & Quality Bar (Visible in standard & theater mode) */}
      {!isFullscreen && (
        <div className="flex items-center justify-between mt-2.5 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400">
          {/* Quality & Resolution Status */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setShowQualityTip(!showQualityTip)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 cursor-pointer hover:border-red-500 transition"
              title="Click for quality info"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono text-[11px]">
                1080p HD
              </span>
              <Info className="w-3 h-3 text-neutral-400 ml-0.5" />
            </div>

            {showQualityTip && (
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-xl animate-in fade-in">
                💡 Tap the ⚙️ Gear icon on the player to choose 1080p, 720p, or 4K quality!
              </div>
            )}
          </div>

          {/* Quick Toolbar: Ambient, Theater, Fullscreen, Download */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Ambient Lighting Toggle */}
            <button
              onClick={() => setAmbientLighting(!ambientLighting)}
              className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
                ambientLighting
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-800/60'
                  : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:text-white'
              }`}
              title={ambientLighting ? 'Disable Ambient Glow' : 'Enable Ambient Glow'}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Ambient</span>
            </button>

            {/* Theater Mode Toggle */}
            <button
              onClick={onToggleTheater}
              className={`p-1.5 rounded-lg border hidden md:flex items-center gap-1 transition ${
                isTheater
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-600 border-red-200 dark:border-red-800/60'
                  : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:text-white'
              }`}
              title={isTheater ? 'Exit Theater Mode (t)' : 'Theater Mode (t)'}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">Theater</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:text-red-500 hover:border-red-500 transition flex items-center gap-1"
              title="Fullscreen (f)"
            >
              <Maximize className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Fullscreen</span>
            </button>

            {/* Download Button */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-1.5 rounded-lg border bg-neutral-100 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:text-red-500 hover:border-red-500 transition flex items-center gap-1"
                title="Download Video or Audio"
              >
                <Download className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline text-[11px] font-medium">Download</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
