// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Custom domain — drives canonical URLs and the generated sitemap.
  // GitHub Pages serves this repo at lsxpartners.com (CNAME in public/).
  site: 'https://lsxpartners.com',
  integrations: [sitemap(), mdx()],
  // The only two real 301s from redirect-map.md. GitHub Pages is static, so
  // Astro emits meta-refresh + canonical redirect pages. Every other legacy
  // URL is preserved 1:1 by matching the file/slug name.
  redirects: {
    '/home': '/',
    '/blog/category/AI+visibility': '/blog/category/ai-visibility',
  },
});