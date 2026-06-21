// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// Wrap each <h2> and the content under it (until the next <h2>) in a
// <section class="post-section"> so blog posts can give each section its own
// subtle background block. Content before the first <h2> stays top-level.
function rehypeSectionize() {
  return (tree) => {
    const out = [];
    let current = null;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        if (current) out.push(current);
        current = { type: 'element', tagName: 'section', properties: { className: ['post-section'] }, children: [node] };
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    if (current) out.push(current);
    tree.children = out;
  };
}

// https://astro.build/config
export default defineConfig({
  // Custom domain — drives canonical URLs and the generated sitemap.
  // GitHub Pages serves this repo at lsxpartners.com (CNAME in public/).
  site: 'https://lsxpartners.com',
  markdown: { rehypePlugins: [rehypeSectionize] },
  integrations: [sitemap(), mdx()],
  // GitHub Pages is static, so Astro emits meta-refresh + canonical redirect
  // pages. The 9 proven pillar posts are preserved 1:1 (200, no redirect).
  redirects: {
    '/home': '/',
    '/blog/category/AI+visibility': '/blog/category/ai-visibility',
    // Retired fractional-marketing posts (LSX is AI-visibility-only now).
    // 301 to the closest live page so equity carries over and nothing 404s.
    '/blog/what-is-fractional-marketing': '/services',
    '/blog/fractional-marketing-team-small-business': '/services',
    '/blog/fractional-marketing-directors-dental-practices': '/services',
    '/blog/marketing-consultant-for-small-business-what-to-look-forand-what-you-really-need': '/services',
    '/blog/small-business-social-media-content-not-working': '/blog',
  },
});