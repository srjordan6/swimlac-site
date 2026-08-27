/**
 * Post-build guard. Run with `npm run verify` after `npm run build`.
 * Fails the build if a legacy slug stopped resolving or an internal link broke.
 * Wire it into CI so nobody can merge a rename that costs the club its SEO.
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

/** Every URL that existed on the old site and must keep working. */
const LEGACY = [
  '/page/home', '/page/about', '/page/about/college-signing-day-', '/page/about/job-openings',
  '/page/about/membership-cost', '/page/about/about-lac', '/page/about/temporary-location-info',
  '/page/locations1', '/page/join-lac', '/page/join-lac/try-out--placement',
  '/page/join-lac/stroke-school1', '/page/join-lac/swim-fit', '/page/join-lac/competitive-team',
  '/page/join-lac/junior-swim-league', '/page/join-lac/guest-swimmers',
  '/page/lac-swim-lessons/info-and-staff', '/page/lac-swim-lessons/levelscurriculum-and-faqs',
  '/page/lac-swim-lessons/how-to-register', '/page/lac-swim-lessons/justin-nisd',
  '/page/lac-swim-lessons/keller-kisd', '/page/lac-swim-lessons/keller-the-keller-pointe',
  '/page/lac-swim-lessons/flower-moundlewisville-westside-aquatic-center-wac',
  '/page/lac-swim-lessons/the-colony-eastside-aquatic-center', '/page/program-info',
  '/page/program-info/the-colony-schedule', '/page/program-info/flower-mnd-schedule',
  '/page/program-info/justin-schedule', '/page/program-info/keller-schedule',
  '/page/events', '/page/events/team-records1', '/page/events/time-standards',
  '/page/alumni', '/page/tu-money', '/page/program-info/justin-location',
  '/page/program-info/flower-mound', '/page/program-info/keller', '/page/program-info/the-colony',
  '/page/parent-info/fees--membership',
];

const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : f.endsWith('.html') && out.push(p);
  }
  return out;
};

const files = walk(DIST);
const built = new Set(['/']);
for (const f of files) {
  const u = '/' + relative(DIST, f).replace(/\\/g, '/');
  built.add(u);
  built.add(u.replace(/\.html$/, ''));
}

const problems = [];

for (const slug of LEGACY) {
  if (!built.has(slug)) problems.push(`MISSING LEGACY SLUG  ${slug}`);
}

const redirects = new Set(
  readFileSync('public/_redirects', 'utf8')
    .split('\n').filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => l.trim().split(/\s+/)[0])
);
const skip = (h) => h.startsWith('/_astro') || h.startsWith('/badges/') || h.startsWith('/logo/')
  || ['/favicon.svg', '/og.jpg', '/robots.txt', '/sitemap-index.xml'].includes(h) || redirects.has(h);

for (const f of files) {
  const src = '/' + relative(DIST, f).replace(/\\/g, '/').replace(/\.html$/, '');
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const h = m[1].replace(/\/$/, '') || '/';
    if (skip(h) || built.has(h)) continue;
    problems.push(`BROKEN LINK  ${h}  on  ${src}`);
  }
}

if (problems.length) {
  console.error(`\n✗ verify failed, ${problems.length} problem(s):\n`);
  console.error([...new Set(problems)].join('\n'));
  process.exit(1);
}
console.log(`✓ ${LEGACY.length} legacy slugs resolve, ${files.length} pages, no broken internal links`);
