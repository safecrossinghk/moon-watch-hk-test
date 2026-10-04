/** Cloudflare Worker template: configure OUTSCRAPER_API_KEY as a Worker secret, never in this frontend. */
import { inferCrowd } from '../src/services/crowdInference.js';
import { CROWD_SEARCH_QUERIES } from '../src/config.js';
const TTL_SECONDS = 300;
export default { async fetch(request, env, ctx) {
  const url = new URL(request.url); if (url.pathname !== '/api/crowd') return new Response('Not found', { status: 404 });
  if (!env.OUTSCRAPER_API_KEY) return Response.json({ ok: false, error: 'OUTSCRAPER_API_KEY is not configured' }, { status: 503 });
  const cache = caches.default; const cached = await cache.match(request); if (cached) return cached;
  try {
    // Implement Outscraper request + normalisation here. Never forward its API key to Browser.
    // Deduplicate places, reject missing coordinates / >500m / missing livePercentage, then call inferCrowd(signals).
    void inferCrowd; void CROWD_SEARCH_QUERIES;
    return Response.json({ ok: false, error: 'Outscraper adapter not configured' }, { status: 503, headers: { 'Cache-Control': `public, max-age=${TTL_SECONDS}` } });
  } catch { return Response.json({ ok: false, error: 'Crowd data temporarily unavailable' }, { status: 502 }); }
} };
