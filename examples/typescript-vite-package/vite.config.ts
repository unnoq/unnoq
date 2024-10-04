import unplugin, { loadExternal } from '@dinwwwh/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  ssr: {
    noExternal: true,
    external: loadExternal('./package.json'),
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
