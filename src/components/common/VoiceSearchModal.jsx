import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function VoiceSearchModal({ isOpen, onClose }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { addSearchQuery } = useApp();

  useEffect(() => {
    let recognition = null;
    if (isOpen) {
      setTranscript('');
      setErrorMsg('');
      setListening(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);

          if (event.results[current].isFinal) {
            setListening(false);
            addSearchQuery(text);
            setTimeout(() => {
              onClose();
              navigate(`/search?q=${encodeURIComponent(text)}`);
            }, 600);
          }
        };

        recognition.onerror = (e) => {
          setListening(false);
          setErrorMsg('Voice recognition unavailable or mic access denied. Try quick prompts below!');
        };

        try {
          recognition.start();
        } catch (e) {
          setListening(false);
        }
      } else {
        setListening(false);
        setErrorMsg('Speech recognition not supported in this browser. Click a quick prompt below:');
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectQuick = (query) => {
    addSearchQuery(query);
    onClose();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#212121] dark:bg-[#212121] text-white rounded-2xl p-6 shadow-2xl border border-neutral-700 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-medium mb-6 text-neutral-100">
          {listening ? 'Listening...' : 'Search with your voice'}
        </h3>

        {/* Microphone animation */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center">
            {listening && (
              <div className="absolute w-28 h-28 rounded-full bg-red-600/30 animate-ping"></div>
            )}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${listening ? 'bg-red-600 shadow-lg shadow-red-600/50' : 'bg-neutral-700'}`}>
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>

          <p className="mt-6 text-center text-lg text-neutral-200 min-h-[32px] px-2 font-medium">
            {transcript || (listening ? 'Say something like "Arijit Singh" or "Taylor Swift"...' : errorMsg)}
          </p>
        </div>

        {/* Quick Voice Prompt Shortcuts */}
        <div className="mt-6 pt-4 border-t border-neutral-700">
          <p className="text-xs text-neutral-400 mb-3 font-medium uppercase tracking-wider">Quick Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {['Arijit Singh Hits', 'Taylor Swift Blank Space', 'Shreya Ghoshal Live', 'Lo-Fi Chill Beats', 'React 19 Tutorial'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSelectQuick(prompt)}
                className="px-3 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 hover:text-white transition flex items-center gap-1.5 border border-neutral-700"
              >
                <Volume2 className="w-3.5 h-3.5 text-red-500" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
