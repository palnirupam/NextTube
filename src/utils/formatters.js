/**
 * Formats view count into human-readable shorthand (e.g. 1.2M views)
 */
export function formatViews(views) {
  if (views === null || views === undefined) return '120K views';
  const num = typeof views === 'string' ? parseInt(views.replace(/[^0-9]/g, ''), 10) : views;
  if (isNaN(num)) return views || '120K views';

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B views';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
  }
  return `${num} views`;
}

/**
 * Formats duration in seconds to mm:ss or hh:mm:ss
 */
export function formatDuration(duration) {
  if (!duration) return '3:45';
  if (typeof duration === 'string' && duration.includes(':')) return duration;

  const totalSec = typeof duration === 'number' ? duration : parseInt(duration, 10);
  if (isNaN(totalSec) || totalSec <= 0) return '4:12';

  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }
  return `${minutes}:${formattedSeconds}`;
}

/**
 * Formats date into relative time (e.g. 3 days ago)
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return '2 days ago';
  if (typeof dateInput === 'string' && dateInput.includes('ago')) return dateInput;

  let date;
  if (typeof dateInput === 'number') {
    date = new Date(dateInput * (dateInput < 10000000000 ? 1000 : 1));
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return '3 days ago';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

/**
 * Extracts a YouTube video ID from various URL formats or raw ID
 */
export function extractVideoId(input) {
  if (!input) return null;
  const cleanInput = input.trim();
  
  // Standard 11 character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanInput)) {
    return cleanInput;
  }

  // Regex patterns for YouTube links
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  ];

  for (const pattern of patterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const candidate = match[1] || match[7];
      if (candidate && candidate.length === 11) {
        return candidate;
      }
    }
  }

  return null;
}
