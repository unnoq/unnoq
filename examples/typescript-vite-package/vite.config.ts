import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    ssr: true,
    sourcemap: true,
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es'],
    },
  },
})
