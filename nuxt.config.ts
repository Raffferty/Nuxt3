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
    // It's good practice to set tags in head that won't change such as your site title default, language and favicon.
    head: {
      title: 'Nuxt3 Tutorial',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        //  these are st by default
        // { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // This controls how your page scales on mobile devices.
        // { charset: 'utf-8' },

        // Windows tile background color (legacy but safe).
        { name: 'msapplication-TileColor', content: '#2b5797' },

        // Modern browser UI color (highly recommended).
        // On mobile, it sets the color of the address bar/status bar.
        // On desktop, Android Chrome uses it for theming the browser tab UI in some contexts.
        { name: 'theme-color', content: '#ffffff' },
      ],
      link: [
        // Fallback .ico
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },

        // Modern SVG
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },

        // PNG favicons
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },

        // instead of this lines we use { rel: 'manifest', href: '/favicon/site.webmanifest' }
        // { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon/web-app-manifest-192x192.png',},
        // { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/favicon/web-app-manifest-512x512.png',},

        // iOS homescreen
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },

        // PWA manifest
        { rel: 'manifest', href: '/favicon/site.webmanifest' },

        // Fonts
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

    // this sets the transition named 'page' between the pages (css is defined in app.vue)
    pageTransition: { name: 'page', mode: 'out-in' },

    // this sets the transition named 'layout' between the layouts (css is defined in app.vue)
    layoutTransition: { name: 'layout', mode: 'out-in' },
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
  runtimeConfig: {
    // runtimeConfig values can be accesd by useRuntimeConfig(), for example: useRuntimeConfig().public.baseUrl

    // keys in runtimeConfig => keys in .env :=> apiSecret = env.NUXT_API_SECRET
    apiSecret: process.env.NUXT_API_SECRET, //! as apiSecret is Not public - it can be accessed ONLY on SERVER side by useRuntimeConfig().apiSecret

    // public.baseUrl = env.NUXT_PUBLIC_BASE_URL
    // public.theme = env.NUXT_PUBLIC_THEME
    // public.apiBase = NUXT_PUBLIC_API_BASE
    public: {
      // the value of baseUrl is taken from process.env.NUXT_PUBLIC_BASE_URL of the served (or built, or generated) .env file
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,

      //! the default values will be overriden by appropriate values from .env file served by LOCAL server:
      // for example: nuxt dev --dotenv .env.development.local

      //! when we build the project as SSR for deployment - the default values will be overriden by appropriate values of env vars of the set on the hosting platform (Vercel, Netlify, Docker, etc.)
      //! when we generate the project as SSG for deployment - the default values will be overriden by appropriate values of env vars in generating time, for example: nuxt generate --dotenv .env.production
      theme: 'default-theme', // as we don't have in .env file the key NUXT_PUBLIC_THEME - the default value for theme will be used: 'default-theme'
      apiBase: 'default-api-base', // as we have in .env file the key NUXT_PUBLIC_API_BASE - it's value will override the default value 'default-api-base'
    },
  },
})
