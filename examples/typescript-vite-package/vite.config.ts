import unplugin from '@dinwwwh/unplugin'
import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
  ssr: {
    noExternal: Object.keys((pkg as any).devDependencies ?? {}),
  },
  build: {
    ssr: true,
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
  },
  plugins: [unplugin.vite()],
})
