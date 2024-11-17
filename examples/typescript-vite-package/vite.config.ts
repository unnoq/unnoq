import unplugin from '@unnoq/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
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
