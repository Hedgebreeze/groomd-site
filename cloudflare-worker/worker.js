// Groomd API Proxy — Cloudflare Worker
// Deploy: cd cloudflare-worker && npx wrangler deploy

const ORIGIN = 'http://46.62.169.104.nip.io';

function cacheTtl(pathname) {
  if (pathname.endsWith('.ndjson')) return 60;
  if (pathname.endsWith('index.json')) return 30;
  return 30;
}

function contentType(pathname) {
  if (pathname.endsWith('.ndjson')) return 'application/x-ndjson';
  return 'application/json';
}

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

    if (!url.pathname.startsWith('/data/')) {
      return corsResponse(request, 'Not found', 404);
    }

    try {
      const ttl = cacheTtl(url.pathname);
      const resp = await fetch(ORIGIN + url.pathname, {
        headers: { 'User-Agent': 'groomd-api-proxy' },
        cf: { cacheTtl: ttl },
      });

      if (resp.status >= 400) {
        return corsResponse(request, JSON.stringify({ error: 'Origin error' }), 502);
      }

      return corsResponse(request, resp.body, 200, {
        'Content-Type': contentType(url.pathname),
        'Cache-Control': `public, max-age=${ttl}`,
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
