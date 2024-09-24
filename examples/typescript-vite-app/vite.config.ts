import { defineConfig } from 'vite'
// @ts-expect-error vite-plugin-on-success is not typed
import { onSuccess } from 'vite-plugin-on-success'

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
  plugins: [onSuccess()],
})
