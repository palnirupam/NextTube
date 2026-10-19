import React, { useState } from 'react';
import {
  X,
  Download,
  Music,
  Video,
  Image,
  Copy,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// cobalt.tools API - open source, free, no new tab required
const COBALT_API = 'https://api.cobalt.tools/';

async function fetchCobaltUrl(videoUrl, mode = 'auto') {
  const res = await fetch(COBALT_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      url: videoUrl,
      downloadMode: mode,       // 'auto' = best video+audio, 'audio' = audio only
      filenameStyle: 'pretty',
      videoQuality: '1080'
    })
  });

  if (!res.ok) throw new Error(`Cobalt HTTP ${res.status}`);
  const data = await res.json();
  return data;
}

function triggerDirectDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function DownloadModal({ video, isOpen, onClose }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useApp();

  if (!isOpen || !video) return null;

  const cleanTitle = (video.title || 'video')
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9_\-\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

  const handleDownloadVideo = async () => {
    setDownloadingFormat('video');
    setError(null);
    showToast('Fetching video stream via cobalt.tools...');

    try {
      const data = await fetchCobaltUrl(videoUrl, 'auto');

      if (data.status === 'tunnel' || data.status === 'redirect' || data.url) {
        triggerDirectDownload(data.url, `${cleanTitle}.mp4`);
        showToast('✅ Video download started! Check your downloads folder.');
      } else if (data.status === 'picker') {
        // Multiple quality options — pick the first/best one
        const best = data.picker?.[0];
        if (best?.url) {
          triggerDirectDownload(best.url, `${cleanTitle}.mp4`);
          showToast('✅ Video download started!');
        } else {
          throw new Error('No stream URL in picker response');
        }
      } else {
        throw new Error(data.error?.code || 'Unknown cobalt response');
      }
    } catch (err) {
      console.error('Cobalt video download error:', err);
      setError('video');
      showToast('⚠️ Direct download failed — opening fallback downloader...');
      // Fallback: ssyoutube redirect (opens URL but cobalt was preferred)
      setTimeout(() => {
        window.open(`https://ssyoutube.com/en/watch?v=${video.id}`, '_blank', 'noopener,noreferrer');
      }, 500);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadAudio = async () => {
    setDownloadingFormat('audio');
    setError(null);
    showToast('Fetching audio stream via cobalt.tools...');

    try {
      const data = await fetchCobaltUrl(videoUrl, 'audio');

      if (data.status === 'tunnel' || data.status === 'redirect' || data.url) {
        triggerDirectDownload(data.url, `${cleanTitle}.mp3`);
        showToast('✅ MP3 audio download started! Check your downloads folder.');
      } else {
        throw new Error(data.error?.code || 'No audio URL returned');
      }
    } catch (err) {
      console.error('Cobalt audio download error:', err);
      setError('audio');
      showToast('⚠️ Audio download failed — try copying link for external apps.');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleDownloadThumbnail = async () => {
    setDownloadingFormat('thumb');
    setError(null);
    showToast('Downloading HD video cover image...');
    try {
      // Try maxresdefault first, then hqdefault
      const urls = [
        `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
      ];

      let blob = null;
      for (const imgUrl of urls) {
        try {
          const res = await fetch(imgUrl);
          if (res.ok) {
            blob = await res.blob();
            break;
          }
        } catch {}
      }

      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        triggerDirectDownload(blobUrl, `${cleanTitle}_Cover.jpg`);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        showToast('✅ HD Thumbnail saved!');
      } else {
        window.open(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`, '_blank');
      }
    } catch (err) {
      window.open(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl).catch(() => {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = videoUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
    setCopied(true);
    showToast('Link copied! Use with IDM, yt-dlp, or any external downloader.');
    setTimeout(() => setCopied(false), 2500);
  };

  const isLoading = downloadingFormat !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#212121] text-neutral-900 dark:text-white rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700 animate-in fade-in zoom-in duration-200 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/10 dark:bg-red-600/20 text-red-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Download</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Powered by cobalt.tools • In-app • No ads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Snippet */}
        <div className="flex gap-3 py-4 border-b border-neutral-200 dark:border-neutral-700 items-center">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-24 h-14 object-cover rounded-xl shrink-0 bg-neutral-200 dark:bg-neutral-800 shadow"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold line-clamp-1 text-neutral-900 dark:text-neutral-200">{video.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{video.channel} • {video.duration || 'Video'}</p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-2.5 py-4">

          {/* 1. Video MP4 */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/10 dark:bg-red-600/20 text-red-600 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Video (MP4 up to 1080p)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white shadow-sm">
                    In-App
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {error === 'video' ? '⚠️ Fallback to web downloader' : 'Direct download, no new tab'}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadVideo}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow active:scale-95 shrink-0"
            >
              {downloadingFormat === 'video' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{downloadingFormat === 'video' ? 'Fetching...' : 'Download'}</span>
            </button>
          </div>

          {/* 2. Audio MP3 */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Audio (MP3 - Best Quality)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Audio Only
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {error === 'audio' ? '⚠️ Failed — copy link as fallback' : 'High-fidelity audio, in-app download'}
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadAudio}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition shadow active:scale-95 shrink-0"
            >
              {downloadingFormat === 'audio' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Music className="w-3.5 h-3.5" />
              )}
              <span>{downloadingFormat === 'audio' ? 'Fetching...' : 'Get MP3'}</span>
            </button>
          </div>

          {/* 3. HD Thumbnail */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 shrink-0">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">HD Poster / Cover</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    Image (JPG)
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Saves thumbnail image directly to device</span>
              </div>
            </div>

            <button
              onClick={handleDownloadThumbnail}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow active:scale-95 shrink-0"
            >
              {downloadingFormat === 'thumb' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Save Image</span>
            </button>
          </div>
        </div>

        {/* Copy Link Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Works with IDM · yt-dlp · Snaptube</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
