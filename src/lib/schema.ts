// JSON-LD builders. Schema = machine-readable trust; baked into templates,
// never hand-rolled per page (ai-site-foundation.md step 3). Shapes adapted
// from clients/kwikset/assets/AI_GEO_implementation.md.
import { SITE, PERSON, SERVICES } from '../consts';

const ORG_ID = `${SITE.url}/#organization`;
const PERSON_ID = `${SITE.url}/#person`;

// Organization — site-wide. Founder links to the Person entity by @id.
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo/primary-rust.svg`,
    foundingDate: SITE.founded,
    founder: { '@id': PERSON_ID },
    sameAs: PERSON.sameAs,
  };
}

// Person — the entity anchor for a founder-led brand. Real credentials.
export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: PERSON.name,
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    honorificSuffix: PERSON.credentials,
    url: `${SITE.url}/about`,
    image: PERSON.image,
    email: PERSON.email,
    worksFor: { '@id': ORG_ID },
    // Topical authority — the entities AI associates Laura with.
    knowsAbout: [
      'AI visibility',
      'Answer engine optimization (AEO)',
      'Generative engine optimization (GEO)',
      'Audience intelligence',
      'Search engine optimization',
      'Content strategy',
      'Brand marketing',
    ],
    sameAs: PERSON.sameAs,
  };
}

// Service — for the services page.
export function serviceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: SITE.tagline,
    provider: { '@id': ORG_ID },
    description: SITE.description,
    areaServed: { '@type': 'Country', name: 'United States' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Visibility & Strategy',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s },
      })),
    },
  };
}

type ArticleInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string | Date;
  dateModified?: string | Date;
};

const iso = (d: string | Date) =>
  typeof d === 'string' ? d : d.toISOString().slice(0, 10);

// Article/BlogPosting — every post. Author = verified Person by @id.
export function articleSchema(a: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    image: a.image ? `${SITE.url}${a.image}` : `${SITE.url}/og-default.png`,
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: a.url,
    datePublished: iso(a.datePublished),
    dateModified: iso(a.dateModified ?? a.datePublished),
  };
}

export type FaqItem = { question: string; answer: string };

// FAQPage — for any page with a real FAQ section (must match on-page content).
export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}

type EventInput = {
  title: string;
  event?: string;
  startISO: string;
  endISO?: string;
  venue: string;
  city?: string;
  description: string;
};

// Event — speaking engagements. Structured date/venue/performer data is exactly
// what AI engines cite for "where/when is X speaking."
export function eventSchema(t: EventInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: t.title,
    startDate: t.startISO,
    endDate: t.endISO || t.startISO,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: t.venue,
      ...(t.city ? { address: t.city } : {}),
    },
    performer: { '@id': PERSON_ID },
    description: t.description,
    ...(t.event ? { superEvent: { '@type': 'Event', name: t.event } } : {}),
  };
}

// DefinedTerm — for glossary/definition blocks (AI loves extractable defs).
export function definedTermSchema(term: string, definition: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
    inDefinedTermSet: `${SITE.url}/glossary`,
  };
}
