# Groomd API Proxy

Cloudflare Worker that proxies requests to the Hetzner origin server, providing CORS headers, edge caching, and hiding the origin IP.

**Live URL:** https://groomd-api.groomd.workers.dev

## Endpoints

### `GET /data/*`

Proxies any path under `/data/` to the origin server at the same path. This serves all ski resort data from the [ski-run-scraper-data](https://github.com/jacobschulman/ski-run-scraper-data) repository.

Examples:

```
GET /data/vail/lifts/index.json       → Vail lift status
GET /data/breckenridge/lifts/index.json → Breckenridge lift status
GET /data/vail/lifts/2026-02-20.ndjson → Vail lift history (NDJSON)
GET /data/vail/snow/index.json        → Vail snow report
GET /data/vail/trails/index.json      → Vail trail status
GET /data/aggregates/latest.json      → Latest cross-resort aggregates
GET /data/aggregates/2026-02-20.json  → Aggregates for a specific date
```

### `GET /health`

Returns `{"status":"ok"}`. Also available at `GET /`.

## Caching

Responses are cached at both the Cloudflare edge and in the browser:

| File type      | TTL  |
|----------------|------|
| `index.json`   | 30s  |
| `.ndjson`      | 60s  |
| Everything else| 30s  |

## CORS

All responses include permissive CORS headers. `OPTIONS` preflight requests are handled automatically.

## Deployment

```bash
cd cloudflare-worker
npx wrangler deploy
```

## Local Development

```bash
cd cloudflare-worker
npx wrangler dev
# Worker runs at http://localhost:8787
```
