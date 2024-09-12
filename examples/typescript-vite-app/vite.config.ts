import path from 'node:path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { onSuccess } from 'vite-plugin-on-success'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  ssr: {
    noExternal: [], // Packages that should be bundled if used in source code (e.g. packages export typescripts)
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
