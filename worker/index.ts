/**
 * swimlac.org edge Worker.
 *
 * Only route: GET /api/calendar?site=<key>
 *
 * Reads the club's Google Calendars and returns plain JSON the site can render
 * in its own design. Coaches add practices in Google Calendar on their phone;
 * nothing here needs a deploy, a developer, or a rebuild.
 *
 * The Google API key never reaches the browser. It lives as a Cloudflare
 * secret and is used only in this Worker:
 *     npx wrangler secret put GOOGLE_CALENDAR_KEY
 *
 * Calendar ids and site keys live in one place,
 * src/calendars.json, which this Worker imports directly so the two cannot drift.
 */

import CALENDARS from '../src/calendars.json';

interface Env {
  ASSETS: Fetcher;
  GOOGLE_CALENDAR_KEY?: string;
}

type Cal = { key: string; label: string; id: string };

interface Ev {
  id: string;
  title: string;
  start: string;      // ISO, or YYYY-MM-DD for all-day
  end: string | null;
  allDay: boolean;
  location: string | null;
  description: string | null;
  site: string;       // calendar key
  siteLabel: string;
  url: string | null;
}

const CACHE_SECONDS = 600;          // ten minutes: fresh enough, cheap enough
const WINDOW_DAYS = 120;            // how far ahead to look
const MAX_PER_CAL = 250;

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
      ...extra,
    },
  });

function normalise(raw: any, cal: Cal): Ev | null {
  if (!raw || raw.status === 'cancelled') return null;
  const allDay = !!raw.start?.date;
  const start = raw.start?.dateTime ?? raw.start?.date;
  if (!start) return null;
  return {
    id: String(raw.id ?? ''),
    title: String(raw.summary ?? 'Untitled'),
    start,
    end: raw.end?.dateTime ?? raw.end?.date ?? null,
    allDay,
    location: raw.location ? String(raw.location) : null,
    description: raw.description ? String(raw.description).slice(0, 600) : null,
    site: cal.key,
    siteLabel: cal.label,
    url: raw.htmlLink ? String(raw.htmlLink) : null,
  };
}

async function fetchCalendar(cal: Cal, key: string): Promise<{ events: Ev[]; error?: string }> {
  const now = new Date();
  const max = new Date(now.getTime() + WINDOW_DAYS * 86400000);
  const u = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events`,
  );
  u.searchParams.set('key', key);
  u.searchParams.set('singleEvents', 'true');   // Google expands recurrence for us
  u.searchParams.set('orderBy', 'startTime');
  u.searchParams.set('timeMin', now.toISOString());
  u.searchParams.set('timeMax', max.toISOString());
  u.searchParams.set('maxResults', String(MAX_PER_CAL));
  u.searchParams.set('fields', 'items(id,summary,location,description,htmlLink,status,start,end)');

  let res: Response;
  try {
    res = await fetch(u.toString(), { cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } });
  } catch {
    return { events: [], error: 'unreachable' };
  }
  if (!res.ok) {
    // 404 usually means the calendar is not shared publicly yet.
    return { events: [], error: res.status === 404 ? 'not_public' : `http_${res.status}` };
  }
  const body: any = await res.json().catch(() => null);
  const items: any[] = Array.isArray(body?.items) ? body.items : [];
  return { events: items.map((i) => normalise(i, cal)).filter(Boolean) as Ev[] };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);

    if (url.pathname !== '/api/calendar') {
      return json({ error: 'not_found' }, 404);
    }
    if (request.method !== 'GET') {
      return json({ error: 'method_not_allowed' }, 405, { allow: 'GET' });
    }

    const cals = CALENDARS as Cal[];
    const want = url.searchParams.get('site');
    const chosen = want && want !== 'all' ? cals.filter((c) => c.key === want) : cals;

    if (want && want !== 'all' && chosen.length === 0) {
      return json({ error: 'unknown_site', sites: cals.map((c) => c.key) }, 404);
    }

    // No calendars configured yet, or no key set: say so plainly so the page
    // can fall back to the printed schedule tables instead of showing nothing.
    const live = chosen.filter((c) => c.id);
    if (!env.GOOGLE_CALENDAR_KEY || live.length === 0) {
      return json({
        configured: false,
        reason: !env.GOOGLE_CALENDAR_KEY ? 'no_api_key' : 'no_calendar_ids',
        events: [],
      });
    }

    const results = await Promise.all(live.map((c) => fetchCalendar(c, env.GOOGLE_CALENDAR_KEY!)));
    const events = results.flatMap((r) => r.events)
      .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
    const problems = live
      .map((c, i) => (results[i].error ? { site: c.key, error: results[i].error } : null))
      .filter(Boolean);

    return json({
      configured: true,
      fetchedAt: new Date().toISOString(),
      sites: live.map((c) => ({ key: c.key, label: c.label })),
      events,
      ...(problems.length ? { problems } : {}),
    });
  },
};
