import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://KamelotDeveloper.github.io',
  base: '/Ordo-landing',
  integrations: [tailwind()],
});
