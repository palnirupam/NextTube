// Background & Screen-Lock Audio Playback Engine (YouTube Premium Feature)
// Prevents players & embedded streams from pausing when device screen is turned off or locked
if (typeof window !== 'undefined') {
  try {
    Object.defineProperty(document, 'hidden', {
      get: () => false,
      configurable: true
    });
    Object.defineProperty(document, 'visibilityState', {
      get: () => 'visible',
      configurable: true
    });

    const origAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (type === 'visibilitychange' || type === 'webkitvisibilitychange') {
        // Intercept visibilitychange so players never pause when screen locks
        return;
      }
      return origAddEventListener.call(this, type, listener, options);
    };
  } catch (e) {
    console.warn('Background playback shim notice:', e);
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
