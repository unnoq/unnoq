import colors from 'tailwindcss/colors'
import defaultConfig from 'tailwindcss/defaultConfig'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './components/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './layouts/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono Variable', ...defaultConfig.theme.fontFamily.mono],
      },
      colors: {
        gray: colors.neutral,
        brand: colors.neutral,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red,
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
