# Setting up the practice calendars

Five Google Calendars, one per practice site and one club-wide. Coaches add
practices in Google Calendar on their phones and the website picks them up
within ten minutes. Nobody needs a developer, a login to the website, or a
deploy.

The club already runs Google Workspace on swimlac.org, so there is nothing to
buy and every coach already has an account.

---

## The one rule that matters

**The calendars must be owned by a club account, not a person.**
Use `teamadmin@swimlac.org` or similar. A calendar owned by an individual
leaves with that individual, and then someone has to be dragged back in to fix
it. Owned by the club, it is set up once and never touched again.

---

## 1. Create the calendars

Signed in as the club account, in Google Calendar, click the **+** beside
"Other calendars" then **Create new calendar**. Make five:

| Name | Holds |
|---|---|
| LAC · The Colony | Practices and closures at Eastside Aquatic Center |
| LAC · Flower Mound | Practices and closures at Westside Aquatic Center |
| LAC · Justin | Practices and closures at the NISD natatorium |
| LAC · Keller | Practices and closures at KISD and The Keller Pointe |
| LAC · Club-wide | Meets, banquets, board meetings, registration deadlines, holiday closures |

Set the time zone on each to **Central Time**.

## 2. Make each one public

Open the calendar's **Settings**, find **Access permissions for events**, tick
**Make available to public**, and set the dropdown to **See all event details**.

Without this the website cannot read the calendar, and its page will quietly
fall back to the printed schedule table.

## 3. Give the coaches edit rights

Still in Settings, under **Share with specific people or groups**, add the
coach or admin who runs that site and set them to **Make changes to events**.

Add people one at a time rather than sharing with everyone. The Keller coach
then cannot edit Justin's practices by accident, and when someone leaves the
club you remove one account rather than changing a password everybody knows.

## 4. Collect the five calendar IDs

In each calendar's Settings, scroll to **Integrate calendar** and copy the
**Calendar ID**. It looks like:

```
c_a1b2c3d4e5f6@group.calendar.google.com
```

Paste each one into `src/calendars.json` against the matching `key`, then
commit. Until an ID is filled in, that site's page shows its printed schedule
table exactly as it does now, so a half-finished setup never breaks anything.

## 5. Add the API key (one time, technical)

The website reads the calendars through Google's Calendar API. The key lives
in Cloudflare and never reaches a visitor's browser.

1. In the Google Cloud console, create a project, for example `swimlac-site`.
2. Enable the **Google Calendar API** on it.
3. Create an **API key** and restrict it to the Calendar API.
4. Store it in Cloudflare:

```bash
npx wrangler secret put GOOGLE_CALENDAR_KEY
```

That is the only technical step, and it is done once.

---

## How it works after that

- A coach adds "Senior Practice, 5:00 to 7:00 AM" to LAC · Keller.
- The Keller schedule page shows it within ten minutes.
- A Keller family taps **Add Keller to your calendar** and every Keller
  practice appears in their own phone calendar from then on, without Justin's
  or The Colony's cluttering it up.

The site asks Cloudflare, Cloudflare asks Google once every ten minutes and
caches the answer, so a busy morning does not hammer anything.

## Retiring the printed tables

Once a site's calendar is populated and a coach has checked a week of it,
delete that site's schedule table from its markdown file. The live calendar
then becomes the single source of truth for that site. Do it one site at a
time, not all four at once.

## If something looks wrong

`https://www.swimlac.org/api/calendar?site=keller` returns exactly what the
site sees. Useful fields:

- `"configured": false, "reason": "no_api_key"` — step 5 has not been done.
- `"configured": false, "reason": "no_calendar_ids"` — step 4 has not been done.
- `"problems": [{"site": "keller", "error": "not_public"}]` — step 2 was missed
  on that calendar.
