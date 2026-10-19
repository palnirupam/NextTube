import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Mail, Link as LinkIcon, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ShareModal({ video, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useApp();

  if (!isOpen || !video) return null;

  const currentUrl = `${window.location.origin}/watch?v=${video.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(video.title + ' ' + currentUrl)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(video.title)}`
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-rose-600',
      url: `mailto:?subject=${encodeURIComponent(video.title)}&body=${encodeURIComponent(currentUrl)}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#212121] dark:bg-[#212121] text-white rounded-2xl p-6 shadow-2xl border border-neutral-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-neutral-100">Share video</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Social Platforms Row */}
        <div className="flex items-center justify-around py-6 border-b border-neutral-700">
          {shareLinks.map(s => {
            const Icon = s.icon;
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-neutral-300 font-medium group-hover:text-white">{s.name}</span>
              </a>
            );
          })}
        </div>

        {/* Link Copy Box */}
        <div className="mt-5">
          <label className="text-xs text-neutral-400 mb-2 block font-medium">Video Link</label>
          <div className="flex items-center bg-[#121212] rounded-xl border border-neutral-700 p-1.5 pr-2">
            <LinkIcon className="w-4 h-4 ml-2.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent border-none text-xs text-neutral-200 w-full px-2 outline-none font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition ${copied ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
