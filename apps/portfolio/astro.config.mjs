import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

// https://astro.build/config
export default defineConfig({
  srcDir: '.',
  site: 'https://unnoq.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    robotsTxt(),
  ],
})
