export default async function handler(req, res) {
  // Enable CORS for Vercel preview & production domains
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse target endpoint from query or URL
  // e.g., /api/yt/youtubei/v1/search or /api/yt?endpoint=/youtubei/v1/search
  let endpoint = req.query.endpoint;
  if (!endpoint) {
    const url = req.url || '';
    const cleanUrl = url.replace(/^\/api\/yt/, '').split('?')[0];
    endpoint = cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
  }

  if (!endpoint || endpoint === '/') {
    endpoint = '/youtubei/v1/search';
  }

  const targetUrl = `https://www.youtube.com${endpoint}`;

  try {
    const bodyData = req.body;
    const bodyStr = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData || {});

    const response = await fetch(targetUrl, {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Origin': 'https://www.youtube.com',
        'Referer': 'https://www.youtube.com/',
        'X-YouTube-Client-Name': '1',
        'X-YouTube-Client-Version': '2.20261016.01.00'
      },
      body: req.method === 'POST' ? bodyStr : undefined
    });

    const data = await response.json();
    res.status(response.status || 200).json(data);
  } catch (error) {
    console.error('Vercel YouTube Proxy Error:', error);
    res.status(500).json({ error: error.message || 'Failed to proxy YouTube API request' });
  }
}
