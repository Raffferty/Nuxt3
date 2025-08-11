// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      // 'no-console': ['error', { allow: ['warn', 'error'] }], // allow console.warn, console.error but not-allow console.log in TypeScript files
    },
  },
)
