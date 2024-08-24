import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: [], // Packages that should be bundled
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
    dts({
      compilerOptions: {
        baseUrl: '.', // This will help dts resolve alias imports
        types: ['vite/client'],
      },
      include: ['src'],
      exclude: [
        '**/*.test.*',
        '**/*.spec.*',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/__snapshots__/**',
      ],
    }),
  ],
})
