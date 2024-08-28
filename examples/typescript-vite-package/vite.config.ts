import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: Object.keys(pkg.devDependencies), // Packages that should be bundled if used in source code
  },
  build: {
    ssr: true, // Prevent bundle all dependencies (except linked dependencies, and above noExternal list) and make it usable in node.js
    target: 'es2022',
    lib: {
      entry: [path.resolve(__dirname, './src/index.ts')],
      formats: ['es'],
    },
  },
  plugins: [
    tsconfigPaths(),
    dts({ tsconfigPath: path.resolve(__dirname, './tsconfig.app.json') }),
  ],
})
