import unplugin from '@unnoq/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: {
        main: 'src/main.ts',
      },
      formats: ['es'],
    },
  },
  plugins: [unplugin.vite()],
})
