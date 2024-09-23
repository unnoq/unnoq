import { defineConfig } from 'vite'
import pkg from './package.json'

export default defineConfig({
  ssr: {
    external: true,
    noExternal: Object.keys(pkg.devDependencies),
  },
  build: {
    ssr: true,
    sourcemap: true,
    lib: {
      entry: {
        'src/index': 'src/index.ts',
      },
      formats: ['es'],
    },
  },
})
