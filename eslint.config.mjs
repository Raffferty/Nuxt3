// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    files: ['**/*.{ts,vue}'],
    rules: {
      // 'no-console': ['error', { allow: ['warn', 'error'] }], // allow console.warn, console.error but not-allow console.log in TypeScript files
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always', // <img />
            normal: 'always', // <div />
            component: 'always', // <MyComponent />
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
)
