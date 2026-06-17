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
  image: `${SITE.url}/laura-seelinger.jpg`, // TODO: add headshot asset (A5)
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
  // "Let's talk AI visibility" — 20 min / Zoom (created via API 2026-06-17).
  calendly: 'https://calendly.com/lsxpartners/let-s-talk-ai-visibility',
  newsletter: 'https://www.linkedin.com/newsletters/cited', // TODO: confirm Cited URL
} as const;

// Services — AI visibility + strategy only.
export const SERVICES = [
  'AI Visibility Audit',
  'AI Visibility Strategy',
  'Audience Intelligence',
  'Content Activation',
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
