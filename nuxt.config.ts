// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image'],

  // disable auto-importing composables and utilities
  // This will disable auto-imports completely but it's still possible to use explicit imports from #imports.
  /* imports: {
    autoImport: false,
  }, */

  // disable auto-importing components from your own ~/components directory
  /* components: {
    dirs: [],
  }, */
  app: {
    head: {
      title: 'Nuxt3 Tutorial',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/ico', href: '/favicon/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/favicon/android-chrome-512x512.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/favicon/android-chrome-192x192.png',
        },
        {
          rel: 'apple-touch-icon',
          type: 'image/png',
          sizes: '180x180',
          href: '/favicon/apple-touch-icon.png',
        },
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Montserrat-Bold.woff2',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Montserrat-ExtraBold.woff2',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Montserrat-Medium.woff2',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  css: ['@/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "@/assets/scss/colors.scss" as *; @use "@/assets/scss/variables.scss" as *; @use "@/assets/scss/mixins.scss" as *;',
          silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
        },
      },
    },
  },
})
