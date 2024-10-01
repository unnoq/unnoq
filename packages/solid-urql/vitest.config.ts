import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['development', 'browser'],
  },

  plugins: [tsconfigPaths(), solid()],
})
