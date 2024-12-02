import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'

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
