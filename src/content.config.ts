import { defineCollection } from 'astro:content';
import { z } from 'astro:schema';
import { glob } from 'astro/loaders';

// Blog content lives as markdown/MDX in src/content/blog/<slug>.md.
// The frontmatter schema is the contract every post must satisfy — keeps
// titles/descriptions/dates present for SEO + Article schema.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(), // front-loaded answer / meta description
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    // Voice register the post is written in (see laura-public-voice memory).
    register: z.enum(['punchy-personal', 'measured-pillar']).default('punchy-personal'),
    // Tags drive the category/tag routes (e.g. ai-visibility).
    tags: z.array(z.string()).default([]),
    // FAQ pairs — rendered as a visible Q&A block + FAQPage JSON-LD (AEO).
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    // Which edge the brand-pattern overlay comes from on the card cover, so it
    // never lands on a face. Default top.
    coverFrom: z.enum(['top', 'bottom', 'left', 'right']).default('top'),
    // Set true to keep a URL live but hide from nav/index (unlisted old posts).
    unlisted: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
