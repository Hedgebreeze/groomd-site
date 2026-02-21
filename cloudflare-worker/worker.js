// Groomd API Proxy — Cloudflare Worker
// Deploy: cd cloudflare-worker && npx wrangler deploy

const ORIGIN = 'http://46.62.169.104.nip.io';

const ROUTES = {
  '/vail/lifts': '/data/vail/lifts/index.json',
  // Add more routes as needed:
  // '/led/vail': '/data/vail/lifts/index.json',
};

const CACHE_TTL = 30;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(request, null, 204);
    }

    // Health check
    if (url.pathname === '/' || url.pathname === '/health') {
      return corsResponse(request, JSON.stringify({ status: 'ok' }), 200);
    }

    if (request.method !== 'GET') {
      return corsResponse(request, 'Method not allowed', 405);
    }

    const originPath = ROUTES[url.pathname];
    if (!originPath) {
      return corsResponse(request, 'Not found', 404);
    }

    try {
      const resp = await fetch(ORIGIN + originPath, {
        headers: { 'User-Agent': 'groomd-api-proxy' },
      });
      const body = await resp.text();

      if (resp.status >= 400) {
        return corsResponse(request, JSON.stringify({ error: 'Origin error' }), 502);
      }

      return corsResponse(request, body, 200, {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${CACHE_TTL}`,
      });
    } catch (err) {
      return corsResponse(request, JSON.stringify({ error: 'Origin unreachable' }), 502);
    }
  },
};

function corsResponse(request, body, status, extraHeaders = {}) {
  const origin = request.headers.get('Origin') || '*';
  return new Response(body, {
    status,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...extraHeaders,
    },
  });
}
