import { defineConfig } from 'vite'
// @ts-expect-error vite-plugin-on-success is not typed
import { onSuccess } from 'vite-plugin-on-success'
import pkg from './package.json'

export default defineConfig({
  ssr: {
    external: true,
    noExternal: Object.keys(pkg.devDependencies),
  },
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
