module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@nuxt/eslint-config',
    'prettier', // <-- disables conflicting ESLint rules
  ],
}
