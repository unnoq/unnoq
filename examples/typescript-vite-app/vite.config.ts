import path from 'node:path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
// @ts-expect-error vite-plugin-on-success does not have types
import { onSuccess } from 'vite-plugin-on-success'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: Object.keys(pkg.devDependencies), // Packages that should be bundled
  },
  build: {
    ssr: true, // Prevent bundle all dependencies (except linked dependencies, and above noExternal list) and make it usable in node.js
    target: 'es2022',
    lib: {
      entry: [path.resolve(__dirname, './src/main.ts')],
      formats: ['es'],
    },
  },
  plugins: [
    tsconfigPaths(),
    onSuccess(),
  ],
})
