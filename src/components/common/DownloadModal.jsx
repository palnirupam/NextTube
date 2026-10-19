import React, { useState } from 'react';
import {
  X,
  Download,
  Music,
  Video,
  Image,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DownloadModal({ video, isOpen, onClose }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  if (!isOpen || !video) return null;

  const cleanTitle = (video.title || 'video').slice(0, 40).replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_');
  const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

  const handleDownloadVideo = (gateway = '10downloader') => {
    setDownloadingFormat(gateway);
    showToast('Opening high-speed MP4 video download portal...');

    let targetUrl = `https://10downloader.com/download?v=${encodeURIComponent(videoUrl)}`;
    if (gateway === 'ssyoutube') {
      targetUrl = `https://www.ssyoutube.com/watch?v=${video.id}`;
    }

    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setDownloadingFormat(null);
    }, 400);
  };

  const handleDownloadAudio = () => {
    setDownloadingFormat('mp3');
    showToast('Opening high-speed MP3 audio download portal...');
    const targetUrl = `https://y2mate.nu/en/youtube/${video.id}`;
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setDownloadingFormat(null);
    }, 400);
  };

  const handleDownloadThumbnail = async () => {
    setDownloadingFormat('thumb');
    showToast('Downloading HD video cover image...');
    try {
      const imgUrl = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`;
      const res = await fetch(imgUrl);
      let blob;
      if (res.ok) {
        blob = await res.blob();
      } else {
        const fallbackRes = await fetch(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
        blob = await fallbackRes.blob();
      }

      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${cleanTitle}_HD_Cover.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      showToast('HD Thumbnail saved to device storage!');
    } catch (err) {
      console.warn('Direct blob fetch error, opening thumbnail in new tab:', err);
      window.open(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`, '_blank');
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    showToast('Clean video link copied! Use in IDM, yt-dlp, or browser.');
    setTimeout(() => setCopied(false), 2500);
  };

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
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Download for Offline Playback</h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">Direct Fast Stream Extraction • No Ads</p>
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

        {/* Real Download Options */}
        <div className="space-y-2.5 py-4">
          {/* 1. Full HD / 720p Video (10Downloader Gateway) */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-600/10 dark:bg-red-600/20 text-red-600 shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Video (MP4 - Full HD / 720p)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white shadow-sm">
                    High Speed
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">1080p, 720p, 480p crystal clear stream</span>
              </div>
            </div>

            <button
              onClick={() => handleDownloadVideo('10downloader')}
              disabled={downloadingFormat !== null}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition shadow active:scale-95 shrink-0"
            >
              {downloadingFormat === '10downloader' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Download</span>
            </button>
          </div>

          {/* 2. Audio Only (MP3 320kbps) */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 shrink-0">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Audio (MP3 - 320kbps)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Audio Only
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">High-fidelity music track offline</span>
              </div>
            </div>

            <button
              onClick={handleDownloadAudio}
              disabled={downloadingFormat !== null}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition shadow active:scale-95 shrink-0"
            >
              {downloadingFormat === 'mp3' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Convert MP3</span>
            </button>
          </div>

          {/* 3. HD Thumbnail (JPG Image) */}
          <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 shrink-0">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">HD Poster Cover</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    Image (JPG)
                  </span>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Full 1920x1080 artwork image</span>
              </div>
            </div>

            <button
              onClick={handleDownloadThumbnail}
              disabled={downloadingFormat !== null}
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

        {/* Copy Clean Link / External Apps Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>IDM / Snaptube / Browser Support</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Link!' : 'Copy Stream Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
