import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import solid from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['development', 'browser'],
  },

  plugins: [
    tsconfigPaths(),
    solid(),
  ],
})
