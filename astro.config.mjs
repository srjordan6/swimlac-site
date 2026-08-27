// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output. Cloudflare Pages serves ./dist directly, no adapter needed.
export default defineConfig({
  site: 'https://www.swimlac.org',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  markdown: {
    // Migrated pages contain iframes (Google Maps, YouTube) copied from the old site.
    shikiConfig: { theme: 'css-variables' },
  },
});
