/* ============================================================================
   Site constants. Everything the club is likely to change lives here.
   ========================================================================== */

export const SITE = {
  name: 'Lakeside Aquatic Club',
  short: 'LAC',
  tagline: 'One team · One vision · One goal',
  mission:
    'To provide an excellence-driven environment where athletes can grow from novice to Olympic-level competition.',
  url: 'https://www.swimlac.org',
  founded: 1982,

  /** Flip to true at go-live. While false, every page ships noindex. */
  indexable: false,
};

/** GoMotion is the member platform. Accounts, registration, billing and the
 *  live calendar stay there; this site links out to them. */
export const GOMOTION = {
  base: 'https://www.gomotionapp.com/team/ntlac',
  signIn: '/Login5.jsp', // rewritten to GoMotion by public/_redirects
  coaches: 'https://www.gomotionapp.com/team/ntlac/page/system/coaches',
  calendar: 'https://www.gomotionapp.com/team/ntlac/EventsCurrent.jsp',
};

export const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/LakesideAquaticClub', icon: 'facebook' },
  { label: 'X', href: 'https://twitter.com/', icon: 'x' },
  { label: 'Instagram', href: 'https://www.instagram.com/lakesideaquatic', icon: 'instagram' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
];

/** Accreditation strip. Drop the five PNGs into public/badges/ (see README).
 *  If an image is missing the link still renders with its label. */
export const BADGES = [
  {
    label: 'USA Swimming 18 & Under World 100',
    short: 'World 100',
    img: '/badges/world-100.png',
    href: 'https://www.usaswimming.org/news-landing-page/2018/10/03/usa-swimming-honors-third-annual-18-under-world-100',
  },
  { label: 'USA Swimming', short: 'USA Swimming', img: '/badges/usa-swimming.png', href: 'https://www.usaswimming.org/' },
  { label: 'North Texas Swimming', short: 'North Texas', img: null, href: 'https://www.ntswim.org/', text: 'North Texas Swimming' },
  {
    label: 'USA Swimming Level 4 Club Recognition',
    short: 'Level 4 Club',
    img: '/badges/level-4.png',
    href: 'https://www.usaswimming.org/articles-landing-page/2017/03/16/club-recognition-program',
  },
  {
    label: 'USA Swimming Gold Medal Club',
    short: 'Gold Medal Club',
    img: '/badges/gold-medal-club.png',
    href: 'https://www.usaswimming.org/news/2025/10/24/2025-26-club-excellence-results',
  },
];

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

/** The full header nav, 34 links, every slug identical to the old site.
 *  Do not change an href without setting up a redirect in public/_redirects. */
export const NAV: NavItem[] = [
  { label: 'Home', href: '/page/home' },
  {
    label: 'About',
    href: '/page/about',
    children: [
      { label: 'Coaches', href: GOMOTION.coaches, external: true },
      { label: 'Signing Day', href: '/page/about/college-signing-day-' },
      { label: 'Jobs', href: '/page/about/job-openings' },
      { label: 'Membership Cost', href: '/page/about/membership-cost' },
      { label: 'About LAC', href: '/page/about/about-lac' },
      { label: 'Temporary Location Info', href: '/page/about/temporary-location-info' },
    ],
  },
  { label: 'Locations', href: '/page/locations1' },
  {
    label: 'Swim Team',
    href: '/page/join-lac',
    children: [
      { label: 'Try Out', href: '/page/join-lac/try-out--placement' },
      { label: 'Stroke', href: '/page/join-lac/stroke-school1' },
      { label: 'Lakeside Fit', href: '/page/join-lac/swim-fit' },
      { label: 'Competitive', href: '/page/join-lac/competitive-team' },
      { label: 'Junior Swim League', href: '/page/join-lac/junior-swim-league' },
      { label: 'Guest', href: '/page/join-lac/guest-swimmers' },
    ],
  },
  {
    // Old site pointed this top-level item at the gomotionapp copy of the same
    // page. Now points at the local page; the slug is unchanged.
    label: 'Lessons',
    href: '/page/lac-swim-lessons/info-and-staff',
    children: [
      { label: 'Info and Staff', href: '/page/lac-swim-lessons/info-and-staff' },
      { label: 'Levels/curriculum and FAQs', href: '/page/lac-swim-lessons/levelscurriculum-and-faqs' },
      { label: 'How to register', href: '/page/lac-swim-lessons/how-to-register' },
      { label: 'Justin - NISD', href: '/page/lac-swim-lessons/justin-nisd' },
      { label: 'Keller - KISD', href: '/page/lac-swim-lessons/keller-kisd' },
      { label: 'Keller - The Keller Pointe', href: '/page/lac-swim-lessons/keller-the-keller-pointe' },
      {
        label: 'Flower Mound/Lewisville - Westside Aquatic Center (WAC)',
        href: '/page/lac-swim-lessons/flower-moundlewisville-westside-aquatic-center-wac',
      },
      { label: 'The Colony - Eastside Aquatic Center', href: '/page/lac-swim-lessons/the-colony-eastside-aquatic-center' },
    ],
  },
  {
    label: 'Schedules',
    href: '/page/program-info',
    children: [
      { label: 'The Colony Schedule', href: '/page/program-info/the-colony-schedule' },
      { label: 'Flower Mound Schedule', href: '/page/program-info/flower-mnd-schedule' },
      { label: 'Justin Schedule', href: '/page/program-info/justin-schedule' },
      { label: 'Keller Schedule', href: '/page/program-info/keller-schedule' },
    ],
  },
  {
    label: 'Event & Team Records',
    href: '/page/events',
    children: [
      { label: 'Team Records', href: '/page/events/team-records1' },
      { label: 'Time Standards', href: '/page/events/time-standards' },
    ],
  },
  { label: 'Alumni', href: '/page/alumni' },
];

/** Pages that exist but are not in the header nav. */
export const ORPHAN_PAGES = ['/page/tu-money'];

export const LOCATIONS = [
  { city: 'The Colony', facility: 'Eastside Aquatic Center', schedule: '/page/program-info/the-colony-schedule', lessons: '/page/lac-swim-lessons/the-colony-eastside-aquatic-center' },
  { city: 'Flower Mound', facility: 'Westside Aquatic Center, Lewisville', schedule: '/page/program-info/flower-mnd-schedule', lessons: '/page/lac-swim-lessons/flower-moundlewisville-westside-aquatic-center-wac' },
  { city: 'Justin', facility: 'Northwest ISD natatorium', schedule: '/page/program-info/justin-schedule', lessons: '/page/lac-swim-lessons/justin-nisd' },
  { city: 'Keller', facility: 'Keller ISD natatorium and The Keller Pointe', schedule: '/page/program-info/keller-schedule', lessons: '/page/lac-swim-lessons/keller-kisd' },
];

/** Flat list of every internal href in the nav, for the build-time link check. */
export function allNavHrefs(): string[] {
  const out: string[] = [];
  const walk = (items: NavItem[]) => {
    for (const i of items) {
      if (!i.external && i.href.startsWith('/')) out.push(i.href);
      if (i.children) walk(i.children);
    }
  };
  walk(NAV);
  return [...new Set(out)];
}

/** Breadcrumb trail for any /page/... path, derived from the nav tree. */
export function crumbsFor(path: string): { label: string; href: string }[] {
  const trail = [{ label: 'Home', href: '/page/home' }];
  for (const top of NAV) {
    if (top.href === path && top.label !== 'Home') {
      trail.push({ label: top.label, href: top.href });
      return trail;
    }
    const kid = top.children?.find((c) => c.href === path);
    if (kid) {
      if (top.href !== path) trail.push({ label: top.label, href: top.href });
      trail.push({ label: kid.label, href: kid.href });
      return trail;
    }
  }
  return trail;
}

/** Nav label for a path, falling back to the page's own title. */
export function navLabelFor(path: string): string | null {
  for (const top of NAV) {
    if (top.href === path) return top.label;
    const kid = top.children?.find((c) => c.href === path);
    if (kid) return kid.label;
  }
  return null;
}

/** Sibling links for the section a path belongs to, for in-page navigation. */
export function siblingsFor(path: string): { label: string; href: string; external?: boolean }[] {
  for (const top of NAV) {
    if (top.children?.some((c) => c.href === path) || top.href === path) {
      return top.children ?? [];
    }
  }
  return [];
}
