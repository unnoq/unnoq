import { defineConfig } from 'vite'
import pkg from './package.json'
import unplugin from './src'

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
