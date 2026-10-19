import React, { useState } from 'react';
import { X, Download, Music, Video, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DownloadModal({ video, isOpen, onClose }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedFormat, setCompletedFormat] = useState(null);
  const { showToast } = useApp();

  if (!isOpen || !video) return null;

  const downloadOptions = [
    { id: '1080p', type: 'video', label: '1080p Full HD (60fps)', size: '142 MB', quality: 'Best Video' },
    { id: '720p', type: 'video', label: '720p HD Standard', size: '68 MB', quality: 'Recommended' },
    { id: '480p', type: 'video', label: '480p Data Saver', size: '32 MB', quality: 'Fast' },
    { id: 'mp3', type: 'audio', label: 'MP3 High-Fidelity Audio (320kbps)', size: '9.4 MB', quality: 'Audio Only' }
  ];

  const handleStartDownload = (opt) => {
    setDownloadingFormat(opt.id);
    setProgress(15);
    setCompletedFormat(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFormat(null);
            setCompletedFormat(opt.id);
            showToast(`Downloaded ${opt.label}! Saved to storage.`);
            // Trigger browser download simulation
            const fakeBlob = new Blob([`PlayTube Stream: ${video.title} [${opt.id}]`], { type: 'text/plain' });
            const url = URL.createObjectURL(fakeBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${video.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${opt.id}.${opt.type === 'audio' ? 'mp3' : 'mp4'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#212121] dark:bg-[#212121] text-white rounded-2xl p-6 shadow-2xl border border-neutral-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-neutral-100">Download for Offline Playback</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Preview Snippet */}
        <div className="flex gap-3 py-4 border-b border-neutral-700 items-center">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-24 h-14 object-cover rounded-lg shrink-0"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-medium line-clamp-1 text-neutral-200">{video.title}</p>
            <p className="text-xs text-neutral-400 mt-1">{video.channel} • {video.duration}</p>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-2.5 py-4">
          {downloadOptions.map(opt => {
            const isProcessing = downloadingFormat === opt.id;
            const isDone = completedFormat === opt.id;

            return (
              <div
                key={opt.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  isDone
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-neutral-700 bg-neutral-800/60 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${opt.type === 'audio' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                    {opt.type === 'audio' ? <Music className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-100">{opt.label}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300">
                        {opt.quality}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400">{opt.size}</span>
                  </div>
                </div>

                <div>
                  {isProcessing ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-700 text-xs">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                      <span>{progress}%</span>
                    </div>
                  ) : isDone ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Downloaded
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartDownload(opt)}
                      disabled={downloadingFormat !== null}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-neutral-400 pt-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Zero Ads • Fast Direct Stream Extract • No Watermark</span>
        </div>
      </div>
    </div>
  );
}
