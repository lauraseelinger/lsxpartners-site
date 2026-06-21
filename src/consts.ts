// Single source of truth for site-wide entity data.
// Entity consistency (same name/description/links everywhere) is one of the
// three things that earn AI citations — see ai-site-foundation.md step 5.
// Schema components and the <head> both read from here, so the brand says the
// SAME thing on-site, in JSON-LD, and (when synced) on LinkedIn + GBP.

export const SITE = {
  url: 'https://lsxpartners.com',
  name: 'LSX Partners',
  // Positioning: AI visibility + strategy ONLY (no fractional marketing).
  tagline: 'AI Visibility & Strategy',
  description:
    'LSX Partners helps brands get cited by AI. AI visibility audits, strategy, and content built so AI engines quote you — not just rank you.',
  founded: '2024',
  locale: 'en_US',
} as const;

// The person is the entity anchor — this is a founder-led personal brand.
export const PERSON = {
  name: 'Laura Seelinger',
  givenName: 'Laura',
  familyName: 'Seelinger',
  jobTitle: 'Founder & AI Visibility Strategist',
  // Keep in lockstep with her LinkedIn headline for entity consistency.
  description:
    'AI visibility expert helping brands get cited by AI. Founder of LSX Partners.',
  credentials: 'MBA',
  image: `${SITE.url}/images/hero-portrait.jpg`,
  email: 'laura@lsxpartners.com',
  sameAs: [
    'https://www.linkedin.com/in/lseelinger',
    // Add: newsletter, YouTube, other verified profiles as the media engine grows.
  ],
} as const;

// Calls-to-action. TODO(Laura): confirm these.
// - Calendly link (MCP token expired at build time — placeholder below).
// - "Cited" newsletter subscribe URL (LinkedIn newsletter, or native later).
export const CTA = {
  // "AI Visibility Intro" — 20 min / Zoom (created via API 2026-06-17).
  calendly: 'https://calendly.com/lsxpartners/ai-visibility-intro',
  // "Cited" LinkedIn newsletter follow link.
  newsletter: 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7436449821441368064',
} as const;

// Services — AI visibility + strategy only.
export const SERVICES = [
  'AI Visibility Audit',
  'AI Visibility Strategy',
  'Audience Intelligence',
  'Content Activation',
] as const;

// Engagement types — Services hub cards + sub-pages.
// NOTE: the flagship name "The AI Visibility Intensive" is a PLACEHOLDER —
// final name to come from the CMO/brand-marketer audience-intelligence work
// (name it in the language buyers actually use). Pricing is intentionally
// omitted everywhere: premium, "by scope," routes to a call.
export const ENGAGEMENTS = [
  {
    slug: 'ai-visibility-intensive',
    name: 'The AI Visibility Intensive',
    flagship: true,
    eyebrow: 'the flagship · one month',
    tagline: 'I come in, map your AI visibility strategy, and get every relevant department aligned on the path to follow.',
    summary: 'A one-month engagement: full audit and audience intelligence, the strategy mapped to your brand, and every team that touches it aligned around a clear path forward — so the plan actually moves after I’m gone.',
    image: '/images/laura-blazer-phone.jpg',
    topics: ['A full audit across every major AI platform', 'Audience intelligence + your AI brand identity', 'A prioritized, brand-specific strategy', 'Alignment across every department that touches it'],
  },
  {
    slug: 'ai-visibility-blueprint',
    name: 'AI Visibility Blueprint',
    flagship: false,
    eyebrow: 'project',
    tagline: 'Build (or rebuild) your site structurally optimized for AI from the ground up.',
    summary: 'The foundation for a website redesign or new build: navigation, sitemap, page templates and schema — plus an ongoing recommendations list to seed what comes next.',
    image: '/images/laura-laptop-site.jpg',
    topics: ['Site architecture mapped to how buyers search', 'Page-type strategy: product, category, hub', 'A build-ready spec for your developers', 'A prioritized post-launch opportunity list'],
  },
  {
    slug: 'ai-visibility-audit',
    name: 'AI Visibility Audit',
    flagship: false,
    eyebrow: 'diagnostic',
    tagline: 'Find out exactly what AI says about your brand — and where the gaps are.',
    summary: 'Knowing what to test is the hard part. I build the prompt set from real buyer language and audience intelligence, run it across every major AI platform, and show you where you show up, where you don’t, and why — the real read, not a false positive.',
    image: '/images/laura-desk-wide.jpg',
    topics: ['A prompt set built from real buyer language — not guesswork — across the major AI platforms', 'Whether your site is even extractable by AI', 'Where your brand lives off your own website', 'Clear findings and the gaps that actually matter'],
  },
  {
    slug: 'embedded-partner',
    name: 'Embedded Partner',
    flagship: false,
    eyebrow: 'ongoing · agencies + in-house',
    tagline: 'The AI visibility expertise your team isn’t staffed for — embedded with you.',
    summary: 'An ongoing monthly partner for agencies and in-house teams: audience intelligence, strategy, content activation and monitoring on a cadence. Can run fully behind your brand.',
    image: '/images/laura-writing.jpg',
    topics: ['Ongoing audience intelligence in your category', 'Strategy plus content built to be cited', 'Monthly monitoring and reporting', 'Fully white-label for agencies'],
  },
] as const;

// Primary nav. Every node must trace to an audience signal and resolve to a
// real retrievable destination (no dead/placeholder links in nav).
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Speaking', href: '/speaking' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

// Blog categories. The `slug` matches a post's first tag (the post's primary
// category) and drives /blog/category/<slug>. Order here = chip order.
export const BLOG_CATEGORIES = [
  { slug: 'ai-visibility', label: 'AI Visibility' },
  { slug: 'guides', label: 'Guides' },
  { slug: 'audience-intelligence', label: 'Audience Intelligence' },
  { slug: 'marketing-pov', label: 'Marketing POV' },
] as const;
export const catLabel = (slug: string) =>
  BLOG_CATEGORIES.find((c) => c.slug === slug)?.label ??
  slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
