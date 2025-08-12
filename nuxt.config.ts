// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/eslint'],
  eslint: {
    // options here
    checker: true, // ESLint checking on runing dev server
  },
  typescript: {
    /*
    Nuxt’s built-in type checking slows down hot-reload a bit
    A faster pattern is:
    
    Dev mode: Run Nuxt with typeCheck: false (no blocking on reloads). - in defineNuxtConfig: typeCheck: process.env.NODE_ENV === 'production'

    Parallel type check: Run "vue-tsc --noEmit --skipLibCheck --watch" (script: "typecheck-watch") in another terminal.
     */

    typeCheck: process.env.NODE_ENV === 'production', // check types only on build time
    // typeCheck: true, // type-checking at build or development time
  },

  imports: {
    /*
      disable auto-importing composables and utilities
      This will disable auto-imports completely but it's still possible to use explicit imports from #imports.
     */
    // autoImport: false,
  },

  // disable auto-importing components from your own ~/components directory
  /* components: {
    dirs: [],
  }, */
  app: {
    head: {
      title: 'Nuxt3 Tutorial',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
      ],
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
      style: [],
      script: [],
      noscript: [
        // <noscript>JavaScript is required</noscript>
        { textContent: 'JavaScript is required' },
      ],
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
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
})
