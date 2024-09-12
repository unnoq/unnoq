import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    tsconfigPaths(),
    dts({
      compilerOptions: {
        paths: {
          /**
           * Bellow paths work when you define baseUrl in typescript config by default
           * vite-tsconfig-paths also support this,
           * but vite-plugin-dts not, so we need explicitly define it here
           */
          'src': ['./src'],
          'src/*': ['./src/*'],
        },
      },
    }),
  ],
})
