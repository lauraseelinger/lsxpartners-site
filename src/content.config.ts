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
    // Opt-in: render each section as an alternating tinted block (good for
    // step-by-step guides). Off elsewhere — headers alone do the breaking up.
    sectioned: z.boolean().default(false),
    // Set true to keep a URL live but hide from nav/index (unlisted old posts).
    unlisted: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// "Cited" Q&A micro-podcast. Each episode is one buyer question (= the title /
// grounding term), an answer-first description, and the written long-form below.
const podcast = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),              // the episode question (= grounding term)
    description: z.string(),        // front-loaded answer-first summary (also the AnswerBlock lead + meta)
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    episode: z.number(),
    duration: z.string().optional(),       // e.g. "PT4M12S" ISO8601, optional
    youtubeId: z.string().optional(),      // YouTube video id for the video version
    buzzsproutEmbed: z.string().optional(),// full Buzzsprout iframe embed html, optional
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    related: z.array(z.string()).default([]),
    unlisted: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, podcast };
