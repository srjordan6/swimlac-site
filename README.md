# swimlac.org

The Lakeside Aquatic Club website. Static site, built with Astro, hosted on
Cloudflare Pages, deployed from this GitHub repo on every push to `main`.

The member portal is **not** in here. Accounts, registration, billing, the
coaches roster and the live events calendar all stay in GoMotion
(`gomotionapp.com/team/ntlac`). This site links out to them. Nothing about a
family's login or payment changes.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes ./dist
npm run preview  # serve ./dist locally
```

Node 22 (see `.nvmrc`).

---

## Deploying

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin git@github.com:<org>/swimlac.git
git push -u origin main
```

### 2. Cloudflare Pages

Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git,
pick this repo, then:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Node version | `22` (environment variable `NODE_VERSION=22`) |

Every push to `main` deploys to production. Every pull request gets its own
preview URL, which is the safe way to show the coach a change before it is live.

### 3. DNS cutover

Do this last, after the go-live checklist below.

1. In Cloudflare Pages → Custom domains, add `www.swimlac.org` and `swimlac.org`.
2. Point the domain's nameservers at Cloudflare, or add the CNAME records
   Cloudflare shows you.
3. Set a redirect so the apex goes to `www` (or the reverse), and keep it
   consistent with the `site` value in `astro.config.mjs`.

---

## Go-live checklist

- [ ] Add the club logo to `public/logo/lac-swimming.png` (see the README in that folder).
- [ ] Add the five accreditation PNGs to `public/badges/` (see the README in that folder).
- [ ] Fill in the real YouTube and X profile URLs in `src/consts.ts` → `SOCIAL`.
      The current X link is `twitter.com/` with no handle, copied from the old site.
- [ ] Confirm the two schedules transcribed from images (see Known issues).
- [ ] Set `SITE.indexable = true` in `src/consts.ts`. This removes the sitewide
      `noindex` tag.
- [ ] Replace `Disallow: /` with `Allow: /` in `public/robots.txt`.
- [ ] Submit `https://www.swimlac.org/sitemap-index.xml` in Google Search Console.
- [ ] Spot check ten old URLs against the live site.

---

## URLs and SEO

**Every slug from the old site is preserved.** The URL of a page is its file
path under `src/content/pages/`, so `src/content/pages/about/about-lac.md`
serves at `/page/about/about-lac`, exactly as it does today.

Renaming or moving a content file changes a public URL and will break inbound
links and search rankings. If you have to, add a `301` line to
`public/_redirects` in the same commit.

38 pages are live at their original slugs: the 34 in the header nav, plus
`/page/tu-money`, `/page/program-info/justin-location`,
`/page/program-info/flower-mound`, `/page/program-info/keller`,
`/page/program-info/the-colony` and `/page/parent-info/fees--membership`,
which are linked from body copy but were never in the nav.

`public/_redirects` also covers the old `.jsp` URLs and adds short aliases
(`/tryout`, `/lessons`, `/schedule`) for anything the club says out loud.

---

## Editing content

Non-developers: see [`docs/EDITING.md`](docs/EDITING.md).

Structure:

```
src/
  consts.ts               nav tree, brand, locations, external links
  content/pages/**.md     one file per page, path = URL
  content.config.ts       frontmatter schema
  components/
    Header.astro          utility bar, badges, 34-link nav, mobile drawer
    Footer.astro
    Water.astro           the WebGL pool background
    HomeContent.astro     home page sections
  layouts/
    Base.astro            head, header, footer, nav behaviour, reveals
    Home.astro
  pages/
    index.astro           /
    page/home.astro       /page/home
    page/[...slug].astro  every migrated page
    404.astro
  styles/                 global.css, header.css, home.css
public/
  _headers _redirects robots.txt favicon.svg og.jpg badges/ logo/
```

The nav lives in one place, `src/consts.ts` → `NAV`. Adding a link there puts
it in the header, the mobile drawer, the footer columns, the 404 page and the
"More in this section" sidebar at once.

---

## Design

Black ground, LAC red, white type. Every colour is sampled from the club's own
site, not invented; the table is in the design spec document. The pool
background is a hand-written WebGL fragment shader, no 3D library, roughly
9KB of GLSL. It degrades to a static gradient without WebGL2 and freezes
under `prefers-reduced-motion`.

---

## Known issues carried over from the migration

These are faults in the source content, reproduced rather than silently fixed,
so the club can decide:

1. **Two schedules exist only as images on the old site.** `/page/program-info/justin-schedule`
   and the fall table on `/page/program-info/the-colony-schedule` were published as
   PNGs, not HTML. They were transcribed cell by cell and each file carries an HTML
   comment saying so. **Have a coach check these two before go-live.**
2. **`/page/join-lac` contains a live placeholder**: "👉 **TRYOUTS** (insert your link)".
   Someone needs to supply that link.
3. **`/page/program-info/keller`** reads "Do enter the pool area until a coach is
   on deck." It almost certainly should say "Do **not** enter."
4. **`/page/parent-info/fees--membership` is a byte-for-byte duplicate** of
   `/page/about/membership-cost`. Both are preserved for SEO. Pick one as canonical
   and point the other at it, or merge them and add a redirect.
5. **`/page/events` has no static copy.** It was an Angular calendar widget rendered
   by GoMotion. The page now explains that and links to the GoMotion calendar.
6. **`/page/events/team-records1` holds no record tables**, only two outbound links to
   `teamunify.com`. Worth rebuilding as real tables later.
7. **`about/temporary-location-info` and the Keller page disagree** on the wording of
   the same temporary facility information.
8. Several source pages had emails written as broken links like
   `http://name@swimlac.org`. These were normalised to `mailto:`.
