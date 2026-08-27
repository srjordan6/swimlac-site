# Editing the website

You do not need to be a developer to change the words on this site. Every page
is a plain text file you can edit in GitHub's web editor.

## Change the words on a page

1. Go to the repo on GitHub and open `src/content/pages/`.
2. Find the file matching the page's address. The path is the address:
   `/page/about/membership-cost` lives at `src/content/pages/about/membership-cost.md`.
3. Click the pencil icon to edit.
4. Change the text. Leave the block at the very top, between the two `---`
   lines, alone unless you mean to change the page title or its description in
   Google results.
5. Scroll down, write a short note about what you changed, and click
   **Commit changes**.

The site rebuilds and goes live in about a minute.

## Formatting

The files use Markdown. The basics:

```markdown
## A heading
### A smaller heading

Normal text. **Bold text.** *Italic text.*

- a bullet
- another bullet

[Link text](/page/join-lac/try-out--placement)
[Link to another website](https://www.usaswimming.org/)

| Group | Days | Time |
|---|---|---|
| Senior | Mon, Wed, Fri | 5:00 to 7:00 AM |
```

Tables need the row of dashes under the header. Every row needs the same
number of `|` bars.

## Practice schedules

Schedules are the pages families check most. When a schedule changes:

- Edit the table in the matching file under `src/content/pages/program-info/`.
- Keep the group names spelled exactly as the coaches use them.
- Do not delete the whole table and retype it. Change the cells that changed.

## Adding a brand new page

Ask a developer. A new file creates a new public address, and there are a few
things to set up at the same time so it appears in the menu.

## Changing the menu

The menu is not edited here. It lives in `src/consts.ts`. Changing a menu
address without a redirect breaks Google results and any link a family has
bookmarked, so a developer should do it.

## Rules worth keeping

- **Never rename or move a file** under `src/content/pages/`. The filename is
  the web address. Renaming it breaks every existing link to that page.
- If something looks wrong after you publish, open the repo, click **History**,
  and revert the change. Nothing is ever lost.
- Sign-in, registration and payments are not on this site. Those live in
  GoMotion and are changed there.
