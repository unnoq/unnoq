import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: [], // Packages that should be bundled if used in source code (e.g. packages export typescripts)
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
    dts({
      tsconfigPath: path.resolve(__dirname, './tsconfig.app.json'),
    }),
  ],
})
