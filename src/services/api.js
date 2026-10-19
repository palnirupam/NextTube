/**
 * PlayTube Streaming & Video Data Service
 * Deep Reverse-Engineered (REA) directly from YouTube InnerTube & Suggestion APIs
 * Universal support for small creators, handles, channels, and videos worldwide
 */

import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { extractVideoId, formatViews, formatDuration } from '../utils/formatters';

// Rich Curated Fallback Videos for instant offline/initial rendering
export const CURATED_VIDEOS = [
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Arijit Singh: Kesariya (Official Audio) | Brahmāstra | Ranbir, Alia | Pritam, Amitabh B',
    channel: 'Sony Music India',
    channelId: 'UCq-Fj5jknLsUf-MWSy4_brA',
    channelAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    subscribers: '62.4M',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    duration: '4:28',
    views: '450M views',
    timestamp: '1 year ago',
    category: 'Music',
    description: 'The soul of Brahmāstra - Kesariya, sung by the melody king Arijit Singh with music composed by Pritam and lyrics by Amitabh Bhattacharya.',
    likes: '4.8M',
    dislikes: '42K'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    channel: 'Luis Fonsi',
    channelId: 'UCLp8RBhQHu9wSsq62j_Md6A',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    subscribers: '31.2M',
    thumbnail: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    duration: '4:41',
    views: '8.3B views',
    timestamp: '7 years ago',
    category: 'Music',
    description: '“Despacito” available on all digital platforms! Watch the official music video for Luis Fonsi - Despacito ft. Daddy Yankee.',
    likes: '53M',
    dislikes: '1.2M'
  },
  {
    id: '09R8_2nJtjg',
    title: 'Ed Sheeran - Shape of You (Official Music Video)',
    channel: 'Ed Sheeran',
    channelId: 'UC0C-w0YjGpqDXGB8IHb662A',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    subscribers: '54.1M',
    thumbnail: 'https://i.ytimg.com/vi/09R8_2nJtjg/hqdefault.jpg',
    duration: '4:23',
    views: '6.2B views',
    timestamp: '6 years ago',
    category: 'Music',
    description: 'The official music video for Ed Sheeran - Shape of You. Taken from the album ÷ (Divide).',
    likes: '33M',
    dislikes: '620K'
  },
  {
    id: 'SlPhMPnQ58k',
    title: 'Shreya Ghoshal - Sun Raha Hai Na Tu (Live Symphony)',
    channel: 'T-Series',
    channelId: 'UCq-Fj5jknLsUf-MWSy4_brA',
    channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    subscribers: '270M',
    thumbnail: 'https://i.ytimg.com/vi/SlPhMPnQ58k/hqdefault.jpg',
    duration: '5:12',
    views: '280M views',
    timestamp: '3 years ago',
    category: 'Music',
    description: 'Melody Queen Shreya Ghoshal performs the iconic female version of Sun Raha Hai Na Tu.',
    likes: '3.4M',
    dislikes: '25K'
  },
  {
    id: 'e-ORhEE9VVg',
    title: 'Taylor Swift - Blank Space (Official Music Video)',
    channel: 'Taylor Swift',
    channelId: 'UCqECaJ8Gagnn7YCbPEzWH6g',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    subscribers: '59.8M',
    thumbnail: 'https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg',
    duration: '4:32',
    views: '3.4B views',
    timestamp: '9 years ago',
    category: 'Music',
    description: 'Exclusive music video for Blank Space performed by Taylor Swift. Directed by Joseph Kahn.',
    likes: '16M',
    dislikes: '450K'
  },
  {
    id: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio 📚 - beats to relax/study to',
    channel: 'Lofi Girl',
    channelId: 'UCSJ4gkVC6NrvII8umztf0Ow',
    channelAvatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&h=100&fit=crop',
    subscribers: '14.2M',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    duration: 'LIVE',
    views: '68K watching',
    timestamp: 'Started streaming',
    category: 'Lo-fi',
    description: 'Welcome to the Lofi Girl stream! Chill beats for studying, relaxing, working, or sleeping.',
    likes: '7.8M',
    dislikes: '12K'
  },
  {
    id: 'eaW0tYpxyp0',
    title: 'Grand Theft Auto VI - Official Reveal Trailer 1',
    channel: 'Rockstar Games',
    channelId: 'UCbW18JZ95AUh3432qr8Wj1A',
    channelAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop',
    subscribers: '11.8M',
    thumbnail: 'https://i.ytimg.com/vi/eaW0tYpxyp0/hqdefault.jpg',
    duration: '1:31',
    views: '215M views',
    timestamp: '9 months ago',
    category: 'Gaming',
    description: 'Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond.',
    likes: '11M',
    dislikes: '45K'
  },
  {
    id: 'bMknfKXIFA8',
    title: 'React 19 & Full-Stack Modern Web Development Masterclass',
    channel: 'freeCodeCamp.org',
    channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    subscribers: '9.8M',
    thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg',
    duration: '2:15:30',
    views: '1.4M views',
    timestamp: '3 months ago',
    category: 'Coding',
    description: 'Learn React 19 from scratch, Server Components, Action hooks, Optimistic UI, and modern production architectures.',
    likes: '68K',
    dislikes: '412'
  }
];

export const CURATED_SHORTS = [
  {
    id: 'fJ9rUzIMcZQ',
    title: 'The melody that conquered the nation ❤️ #Kesariya #ArijitSingh #Shorts',
    channel: 'Sony Music India',
    channelAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop',
    likes: '1.4M',
    commentsCount: '8.2K',
    musicTitle: 'Kesariya - Arijit Singh & Pritam',
    description: 'Arijit Singh recording Kesariya vocals live in studio.'
  },
  {
    id: 'SlPhMPnQ58k',
    title: 'Pure goosebumps when Shreya Ghoshal hit this high note live! 🎶✨',
    channel: 'Melody Queen Records',
    channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    likes: '890K',
    commentsCount: '5.1K',
    musicTitle: 'Sun Raha Hai Na Tu - Shreya Ghoshal',
    description: 'Unbelievable vocal control in front of 40,000 live concert fans.'
  },
  {
    id: 'e-ORhEE9VVg',
    title: 'Taylor Swift writing Blank Space chord progression in 10 minutes 🎸',
    channel: 'Swiftie Moments',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    likes: '2.1M',
    commentsCount: '19.4K',
    musicTitle: 'Blank Space - Taylor Swift',
    description: 'Behind the scenes acoustic songwriting session.'
  },
  {
    id: 'eaW0tYpxyp0',
    title: 'GTA 6 Physics and Graphics compared to Real Life Vice City 🌴',
    channel: 'Gaming Pulse',
    channelAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop',
    likes: '3.6M',
    commentsCount: '34.8K',
    musicTitle: 'Love Is A Long Road - Tom Petty',
    description: 'Insane details in the Rockstar trailer spotted by frame-by-frame analysis.'
  },
  {
    id: 'bMknfKXIFA8',
    title: 'Top 3 React 19 features every frontend dev MUST know in 2024! 🚀💻',
    channel: 'CodeSnippet',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    likes: '420K',
    commentsCount: '3.2K',
    musicTitle: 'Lofi Chill Beat - Tech Vibes',
    description: 'useActionState, useOptimistic, and Server Actions explained in 45 seconds.'
  }
];

/**
 * Universal Reverse-Engineered HTTP Requester
 * Handles Native Android (CapacitorHttp) and Web (Proxy / Direct)
 */
async function postYouTubeAPI(endpoint, payload) {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    const res = await CapacitorHttp.post({
      url: `https://www.youtube.com${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
        'Origin': 'https://www.youtube.com',
        'Referer': ''
      },
      data: payload
    });
    return res.data;
  }

  // Web Browser: use proxy (/api/yt on Vite or Vercel rewrites)
  const proxyUrl = `/api/yt${endpoint}?prettyPrint=false`;
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`YouTube API failed with HTTP ${res.status}`);
  }

  return await res.json();
}

/**
 * Clean URL helper ensuring https:
 */
export function cleanMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('//')) return 'https:' + url;
  return url;
}

/**
 * Parse a raw videoRenderer from InnerTube into PlayTube Video Object
 */
function parseVideoRenderer(v) {
  const videoId = v.videoId;
  const title = v.title?.runs?.map(r => r.text).join('') || v.title?.simpleText || 'YouTube Video';
  const channelName = v.ownerText?.runs?.[0]?.text || v.shortBylineText?.runs?.[0]?.text || 'Creator';
  const channelId = v.ownerText?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId || `UC_${channelName}`;
  const viewsText = v.viewCountText?.simpleText || (v.viewCountText?.runs?.map(r => r.text).join('')) || '1.2M views';
  const durationText = v.lengthText?.simpleText || (v.lengthSeconds ? `${Math.floor(v.lengthSeconds / 60)}:${(v.lengthSeconds % 60).toString().padStart(2, '0')}` : '3:45');
  const timestampText = v.publishedTimeText?.simpleText || 'Recently uploaded';
  const descriptionSnippet = v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map(r => r.text).join('') ||
    v.descriptionSnippet?.runs?.map(r => r.text).join('') ||
    `Watch ${title} by ${channelName} ad-free on PlayTube.`;

  let avatarUrl = cleanMediaUrl(v.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail?.thumbnails?.[0]?.url);
  if (!avatarUrl) avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channelName)}`;

  let bestThumbnail = cleanMediaUrl(v.thumbnail?.thumbnails?.[v.thumbnail.thumbnails.length - 1]?.url);
  if (!bestThumbnail) bestThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    id: videoId,
    title,
    channel: channelName,
    channelId,
    channelAvatar: avatarUrl,
    subscribers: 'Verified Artist',
    thumbnail: bestThumbnail,
    duration: durationText,
    views: viewsText,
    timestamp: timestampText,
    category: 'Music',
    description: descriptionSnippet,
    likes: '150K',
    dislikes: '1.2K'
  };
}

/**
 * Parse a modern YouTube lockupViewModel from InnerTube
 */
function parseLockup(lvm, defaultChannel = 'Creator') {
  const videoId = lvm.contentId;
  const meta = lvm.metadata?.lockupMetadataViewModel;
  const title = meta?.title?.content || 'YouTube Stream';
  const rows = meta?.metadata?.contentMetadataViewModel?.metadataRows || [];

  let channel = defaultChannel;
  let views = '100K views';
  let timestamp = 'Recently';

  if (rows.length === 1) {
    const parts = rows[0]?.metadataParts || [];
    if (parts[0]?.text?.content) views = parts[0].text.content;
    if (parts[1]?.text?.content) timestamp = parts[1].text.content;
  } else if (rows.length >= 2) {
    const p0 = rows[0]?.metadataParts?.[0]?.text?.content;
    const p1 = rows[1]?.metadataParts?.[0]?.text?.content;
    const p2 = rows[1]?.metadataParts?.[1]?.text?.content;

    if (p0 && !p0.includes('view') && !p0.includes('ago')) {
      channel = p0;
      if (p1) views = p1;
      if (p2) timestamp = p2;
    } else {
      if (p0) views = p0;
      if (p1) timestamp = p1;
    }
  }

  let duration = '3:45';
  const overlays = lvm.contentImage?.thumbnailViewModel?.overlays || [];
  for (const o of overlays) {
    const badgeText = o.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
    if (badgeText) duration = badgeText;
  }

  const thumbs = lvm.contentImage?.thumbnailViewModel?.image?.sources || [];
  const thumbnail = cleanMediaUrl(thumbs[thumbs.length - 1]?.url) || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    id: videoId,
    title,
    channel,
    channelId: `UC_${channel.replace(/\s+/g, '')}`,
    channelAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channel)}`,
    subscribers: 'Official Creator',
    thumbnail,
    duration,
    views,
    timestamp,
    category: 'Music',
    description: `Watch ${title} by ${channel} ad-free on PlayTube in full HD 1080p.`,
    likes: '120K',
    dislikes: '950'
  };
}

/**
 * Parse a shortsLockupViewModel into PlayTube Short Object
 */
function parseShortsLockup(s) {
  const videoId = s.onTap?.innertubeCommand?.reelWatchEndpoint?.videoId ||
                  s.entityId?.replace('shorts-shelf-item-', '') ||
                  '';
  const title = s.overlayMetadata?.primaryText?.content || 'Viral Short';
  const views = s.overlayMetadata?.secondaryText?.content || '500K views';
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return {
    id: videoId,
    title,
    channel: 'Shorts Creator',
    channelAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(videoId)}`,
    likes: views,
    commentsCount: '1.5K',
    musicTitle: 'Original Sound',
    description: title,
    thumbnail
  };
}

/**
 * Deep REA YouTube Search
 * Extracts Creators/Channels (big & small), Videos, and Shorts
 */
export async function searchVideos(query) {
  if (!query || !query.trim()) {
    const defaultList = [...CURATED_VIDEOS];
    defaultList.channels = [];
    defaultList.videos = CURATED_VIDEOS;
    defaultList.shorts = CURATED_SHORTS;
    return defaultList;
  }

  const trimmed = query.trim();

  // If input is a direct YouTube URL or 11-char ID
  const directId = extractVideoId(trimmed);
  if (directId) {
    const details = await getVideoDetails(directId);
    const list = [details, ...CURATED_VIDEOS];
    list.channels = [];
    list.videos = list;
    list.shorts = CURATED_SHORTS;
    return list;
  }

  try {
    const payload = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20240101.01.00',
          hl: 'en',
          gl: 'US'
        }
      },
      query: trimmed
    };

    const data = await postYouTubeAPI('/youtubei/v1/search', payload);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    
    const extractedChannels = [];
    const extractedVideos = [];
    const extractedShorts = [];

    for (const c of contents) {
      const items = c.itemSectionRenderer?.contents || [];

      for (const item of items) {
        // 1. Channel Renderer (small & large creators)
        if (item.channelRenderer) {
          const cr = item.channelRenderer;
          let avatar = cleanMediaUrl(cr.thumbnail?.thumbnails?.[0]?.url);
          if (!avatar) avatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cr.title?.simpleText || 'creator')}`;

          const title = cr.title?.simpleText || 'Creator';
          const handle = cr.subscriberCountText?.simpleText?.startsWith('@')
            ? cr.subscriberCountText?.simpleText
            : `@${title.replace(/\s+/g, '').toLowerCase()}`;

          extractedChannels.push({
            isChannel: true,
            type: 'channel',
            id: cr.channelId,
            title,
            handle,
            subscribers: cr.videoCountText?.simpleText || cr.subscriberCountText?.simpleText || 'Creator Channel',
            videoCount: cr.videoCountText?.simpleText,
            avatar,
            description: cr.descriptionSnippet?.runs?.map(r => r.text).join('') || 'YouTube Creator Channel'
          });
        }

        // 2. Direct Video Renderer
        if (item.videoRenderer && item.videoRenderer.videoId) {
          extractedVideos.push(parseVideoRenderer(item.videoRenderer));
        }

        // 3. Modern Lockup View Model inside search
        if (item.lockupViewModel && item.lockupViewModel.contentId) {
          extractedVideos.push(parseLockup(item.lockupViewModel));
        }

        // 4. Shorts Shelves (gridShelfViewModel)
        if (item.gridShelfViewModel) {
          const shelfContents = item.gridShelfViewModel.contents || [];
          for (const sc of shelfContents) {
            if (sc.shortsLockupViewModel) {
              const short = parseShortsLockup(sc.shortsLockupViewModel);
              if (short.id) extractedShorts.push(short);
            }
          }
        }

        // 5. Classic Shelves
        if (item.shelfRenderer) {
          const shelfItems = item.shelfRenderer.content?.verticalListRenderer?.items ||
                             item.shelfRenderer.content?.horizontalListRenderer?.items || [];
          for (const si of shelfItems) {
            if (si.videoRenderer && si.videoRenderer.videoId) {
              extractedVideos.push(parseVideoRenderer(si.videoRenderer));
            }
          }
        }
      }
    }

    if (extractedChannels.length > 0 || extractedVideos.length > 0) {
      const unified = [...extractedChannels, ...extractedVideos];
      unified.channels = extractedChannels;
      unified.videos = extractedVideos;
      unified.shorts = extractedShorts;
      return unified;
    }
  } catch (err) {
    console.warn('Real YouTube search fallback active:', err);
  }

  const lowerQ = trimmed.toLowerCase();
  const matched = CURATED_VIDEOS.filter(v =>
    v.title.toLowerCase().includes(lowerQ) ||
    v.channel.toLowerCase().includes(lowerQ) ||
    v.category.toLowerCase().includes(lowerQ)
  );

  const fallbackResult = matched.length > 0 ? matched : CURATED_VIDEOS;
  fallbackResult.channels = [];
  fallbackResult.videos = fallbackResult;
  fallbackResult.shorts = CURATED_SHORTS;
  return fallbackResult;
}

/**
 * Fetch Channel Profile, Videos & Shorts by Channel ID or Creator Name
 * Deep REA using /youtubei/v1/browse with exact protobuf tokens
 */
export async function getChannelProfile(channelId, channelName) {
  let ucId = channelId?.startsWith('UC') ? channelId : null;
  let chanMeta = null;
  let searchBackupVideos = [];

  try {
    // Step 1: Query YouTube InnerTube search to find channel metadata if needed
    const query = channelName || channelId;
    const searchRes = await searchVideos(query);
    searchBackupVideos = searchRes.videos || [];

    if (searchRes.channels && searchRes.channels.length > 0) {
      const matched = searchRes.channels.find(c => c.id === channelId || c.title?.toLowerCase() === channelName?.toLowerCase()) || searchRes.channels[0];
      if (matched) {
        if (!ucId && matched.id?.startsWith('UC')) ucId = matched.id;
        chanMeta = { ...matched };
      }
    }

    // Step 2: If we have a UC ID, browse the channel's official Videos tab
    let videos = [];
    let shorts = [];

    if (ucId) {
      // 2a. Fetch Videos tab (params: "EgZ2aWRlb3PyBgQKAjoA")
      try {
        const vData = await postYouTubeAPI('/youtubei/v1/browse', {
          context: { client: { clientName: 'WEB', clientVersion: '2.20240101.01.00', hl: 'en', gl: 'US' } },
          browseId: ucId,
          params: 'EgZ2aWRlb3PyBgQKAjoA'
        });

        // Extract channel metadata from header if not yet populated
        if (!chanMeta) {
          const phr = vData.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
          const c4 = vData.header?.c4TabbedHeaderRenderer;
          if (phr) {
            const title = phr.title?.dynamicTextViewModel?.text?.content || channelName || 'Creator';
            const avatar = cleanMediaUrl(phr.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel?.image?.sources?.[0]?.url);
            const mRows = phr.metadata?.contentMetadataViewModel?.metadataRows || [];
            const handle = mRows[0]?.metadataParts?.[0]?.text?.content || `@${title.replace(/\s+/g, '').toLowerCase()}`;
            const subs = mRows[1]?.metadataParts?.[0]?.text?.content || 'Official Creator';
            const vCount = mRows[1]?.metadataParts?.[1]?.text?.content || 'Uploaded Videos';

            chanMeta = {
              id: ucId,
              title,
              handle,
              subscribers: subs,
              videoCount: vCount,
              avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(title)}`,
              description: `Welcome to the official creator channel for ${title} on PlayTube.`
            };
          } else if (c4) {
            chanMeta = {
              id: ucId,
              title: c4.title || channelName || 'Creator',
              handle: `@${(c4.title || 'creator').replace(/\s+/g, '').toLowerCase()}`,
              subscribers: c4.subscriberCountText?.simpleText || 'Official Creator',
              videoCount: 'Uploaded Videos',
              avatar: cleanMediaUrl(c4.avatar?.thumbnails?.[0]?.url) || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(c4.title || 'creator')}`,
              description: c4.descriptionSnippet?.runs?.map(r => r.text).join('') || 'Official YouTube Channel'
            };
          }
        }

        // Parse Videos grid
        const tabs = vData.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
        const vTab = tabs.find(t => t.tabRenderer?.selected) || tabs[1] || tabs[0];
        const grid = vTab?.tabRenderer?.content?.richGridRenderer?.contents ||
                     vTab?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

        for (const item of grid) {
          // Modern lockupViewModel
          if (item.richItemRenderer?.content?.lockupViewModel) {
            videos.push(parseLockup(item.richItemRenderer.content.lockupViewModel, chanMeta?.title || channelName));
          }
          // Classic videoRenderer
          else if (item.richItemRenderer?.content?.videoRenderer) {
            videos.push(parseVideoRenderer(item.richItemRenderer.content.videoRenderer));
          } else if (item.videoRenderer) {
            videos.push(parseVideoRenderer(item.videoRenderer));
          }
        }
      } catch (err) {
        console.warn('Browse videos tab fetch notice:', err);
      }

      // 2b. Fetch Shorts tab (params: "EgZzaG9ydHPyBgQKAjoA")
      try {
        const sData = await postYouTubeAPI('/youtubei/v1/browse', {
          context: { client: { clientName: 'WEB', clientVersion: '2.20240101.01.00', hl: 'en', gl: 'US' } },
          browseId: ucId,
          params: 'EgZzaG9ydHPyBgQKAjoA'
        });
        const tabs = sData.contents?.twoColumnBrowseResultsRenderer?.tabs || [];
        const sTab = tabs.find(t => t.tabRenderer?.selected);
        const sGrid = sTab?.tabRenderer?.content?.richGridRenderer?.contents || [];
        for (const item of sGrid) {
          const lvm = item.richItemRenderer?.content?.lockupViewModel;
          if (lvm && lvm.contentId) {
            shorts.push({
              id: lvm.contentId,
              title: lvm.metadata?.lockupMetadataViewModel?.title?.content || 'Short',
              channel: chanMeta?.title || channelName || 'Creator',
              channelAvatar: chanMeta?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(chanMeta?.title || 'creator')}`,
              likes: '25K',
              commentsCount: '340',
              musicTitle: 'Original Audio',
              thumbnail: `https://i.ytimg.com/vi/${lvm.contentId}/hqdefault.jpg`
            });
          }
        }
      } catch (err) {
        console.warn('Browse shorts tab notice:', err);
      }
    }

    // Merge with searchBackupVideos if browse yielded few
    if (videos.length === 0 && searchBackupVideos.length > 0) {
      videos = searchBackupVideos;
    }

    // Ensure fallback channel metadata if not set
    if (!chanMeta) {
      const name = channelName || (channelId?.startsWith('UC') ? 'YouTube Creator' : channelId);
      chanMeta = {
        id: ucId || channelId || 'UC_creator',
        title: name,
        handle: `@${name.replace(/\s+/g, '').toLowerCase()}`,
        subscribers: 'Official Creator',
        videoCount: `${videos.length} videos`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
        description: `Watch official uploads, videos, and music by ${name} on PlayTube.`
      };
    }

    return {
      channel: chanMeta,
      videos: videos.length > 0 ? videos : CURATED_VIDEOS,
      shorts: shorts.length > 0 ? shorts : CURATED_SHORTS
    };
  } catch (e) {
    console.error('getChannelProfile error:', e);
    return {
      channel: {
        id: channelId || 'UC_creator',
        title: channelName || 'YouTube Creator',
        handle: '@creator',
        subscribers: '10K subscribers',
        videoCount: '24 videos',
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channelName || 'creator')}`,
        description: 'Official YouTube channel profile.'
      },
      videos: searchBackupVideos.length > 0 ? searchBackupVideos : CURATED_VIDEOS,
      shorts: CURATED_SHORTS
    };
  }
}

/**
 * Live Home Feed Engine
 * Delivers continuous list-by-list video streaming like real YouTube
 */
export async function getHomeFeed(category = 'All', page = 1) {
  let query = 'Trending music and videos';

  if (category === 'Music') {
    query = page === 1 ? 'Top Indian & Global Music 2024' : 'Arijit Singh Shreya Ghoshal Taylor Swift songs';
  } else if (category === 'Gaming') {
    query = page === 1 ? 'Top Trending Gaming Walkthroughs & Trailers' : 'GTA 6 Minecraft Speedrun Esports';
  } else if (category === 'Lo-fi') {
    query = 'Lofi hip hop beats to relax study to';
  } else if (category === 'Live') {
    query = 'Live stream music news gaming';
  } else if (category === 'Coding') {
    query = page === 1 ? 'React full stack web development tutorials' : 'Python AI coding tutorials freeCodeCamp';
  } else if (category === 'Podcasts') {
    query = 'Top Popular Podcasts interviews';
  } else {
    // 'All' - page rotation
    const allQueries = [
      'Trending music and videos',
      'Global viral video hits 2024',
      'Top entertainment and music',
      'Popular new uploads'
    ];
    query = allQueries[(page - 1) % allQueries.length];
  }

  try {
    const res = await searchVideos(query);
    const videos = res.videos || res.filter(x => !x.isChannel);
    const shorts = res.shorts && res.shorts.length > 0 ? res.shorts : CURATED_SHORTS;

    if (videos.length > 0) {
      return { videos, shorts };
    }
  } catch (err) {
    console.warn('getHomeFeed network notice:', err);
  }

  return {
    videos: CURATED_VIDEOS,
    shorts: CURATED_SHORTS
  };
}

/**
 * Live YouTube Shorts Feed
 * Delivers endless vertical video feed for reels/shorts
 */
export async function getShortsFeed(query = '#shorts trending') {
  try {
    const res = await searchVideos(query);
    let shorts = res.shorts || [];

    // Also convert any video items that look short or from search
    if (shorts.length < 5 && res.videos) {
      const converted = res.videos.map(v => ({
        id: v.id,
        title: v.title,
        channel: v.channel,
        channelAvatar: v.channelAvatar,
        likes: v.views || '150K',
        commentsCount: '1.2K',
        musicTitle: `${v.channel} - Original Sound`,
        description: v.title,
        thumbnail: v.thumbnail
      }));
      shorts = [...shorts, ...converted];
    }

    if (shorts.length > 0) {
      return shorts;
    }
  } catch (err) {
    console.warn('getShortsFeed error:', err);
  }

  return CURATED_SHORTS;
}

/**
 * Real YouTube Video Details
 */
export async function getVideoDetails(videoId) {
  if (!videoId) return CURATED_VIDEOS[0];

  try {
    const payload = {
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20240101.01.00',
          hl: 'en',
          gl: 'US'
        }
      },
      videoId: videoId
    };

    const data = await postYouTubeAPI('/youtubei/v1/player', payload);

    if (data && data.videoDetails) {
      const v = data.videoDetails;
      const durationSec = parseInt(v.lengthSeconds || '240', 10);
      const formattedDur = `${Math.floor(durationSec / 60)}:${(durationSec % 60).toString().padStart(2, '0')}`;

      return {
        id: v.videoId,
        title: v.title || 'YouTube Stream',
        channel: v.author || 'Artist',
        channelId: v.channelId || `UC_${v.author}`,
        channelAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(v.author || v.videoId)}`,
        subscribers: 'Official Channel',
        thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: formattedDur,
        views: formatViews(v.viewCount),
        timestamp: 'Recently uploaded',
        category: 'Music',
        description: v.shortDescription || 'Enjoy ad-free high fidelity playback on PlayTube.',
        likes: '250K',
        dislikes: '1.5K'
      };
    }
  } catch (err) {
    console.warn('Live player details fetch error:', err);
  }

  const existing = CURATED_VIDEOS.find(v => v.id === videoId);
  if (existing) return existing;

  return {
    id: videoId,
    title: 'High-Definition YouTube Stream',
    channel: 'Verified YouTube Artist',
    channelId: `UC_${videoId}`,
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    subscribers: '1.2M',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: '4:15',
    views: '2.4M views',
    timestamp: '2 days ago',
    category: 'Music',
    description: `High-fidelity audio and video playback for video ID: ${videoId}. Ad-free, responsive, and seamless experience powered by PlayTube.`,
    likes: '88K',
    dislikes: '950'
  };
}

/**
 * Real-time YouTube Auto-Complete Suggestions via JSONP
 * Zero CORS Restrictions anywhere in the world!
 */
export function getSearchSuggestions(query) {
  if (!query || !query.trim()) return Promise.resolve([]);

  return new Promise((resolve) => {
    const callbackName = 'yt_suggest_' + Math.floor(Math.random() * 1000000);
    const script = document.createElement('script');

    const cleanup = () => {
      try {
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      } catch {
        // ignore
      }
    };

    window[callbackName] = (data) => {
      cleanup();
      if (data && data[1] && Array.isArray(data[1])) {
        const suggestions = data[1].map(item => (Array.isArray(item) ? item[0] : item)).filter(Boolean);
        resolve(suggestions.slice(0, 8));
      } else {
        resolve([]);
      }
    };

    script.src = `https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&jsonp=${callbackName}&q=${encodeURIComponent(query.trim())}`;
    script.onerror = () => {
      cleanup();
      resolve([]);
    };

    document.head.appendChild(script);

    setTimeout(() => {
      cleanup();
      resolve([]);
    }, 2000);
  });
}
