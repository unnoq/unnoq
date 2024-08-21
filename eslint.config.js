import antfu from '@antfu/eslint-config'

export default antfu(
  {
    astro: true,
    react: true,
    ignores: ['**/*.gen.ts'],

  },
  {
    rules: {
      'react/prefer-destructuring-assignment': ['off'],
      'unicorn/prefer-includes': ['off'],
    },
  },
)
