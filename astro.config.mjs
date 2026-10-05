// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

// Do NOT set `base` here. Webflow Cloud sets it at build time from your
// environment's mount path (e.g. /academy). Locally the app runs at "/".
export default defineConfig({
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@webflow': fileURLToPath(new URL('./webflow', import.meta.url)),
      },
    },
  },
});
