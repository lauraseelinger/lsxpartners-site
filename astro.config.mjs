// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Custom domain — drives canonical URLs and the generated sitemap.
  // GitHub Pages serves this repo at lsxpartners.com (CNAME in public/).
  site: 'https://lsxpartners.com',
  integrations: [sitemap()],
});