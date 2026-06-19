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
  // The only two real 301s from redirect-map.md. GitHub Pages is static, so
  // Astro emits meta-refresh + canonical redirect pages. Every other legacy
  // URL is preserved 1:1 by matching the file/slug name.
  redirects: {
    '/home': '/',
    '/blog/category/AI+visibility': '/blog/category/ai-visibility',
  },
});