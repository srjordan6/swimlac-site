import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Every page migrated from the old site. The file path under
 *  src/content/pages/ IS the URL slug after /page/, so renaming a file
 *  changes a public URL. Don't, without a redirect. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    status: z.enum(['migrated', 'empty', 'gated', 'partial']).default('migrated'),
    /** Show a live Google Calendar on this page. Value is a key from
     *  src/calendars.json, or "all" for the combined view. */
    calendar: z.string().optional(),
  }),
});

export const collections = { pages };
