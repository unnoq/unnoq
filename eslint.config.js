import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  formatters: true,
}, {
  rules: {
    'ts/consistent-type-definitions': 'off',
    'react-refresh/only-export-components': 'off',
    'react/prefer-destructuring-assignment': 'off',
  },
})
