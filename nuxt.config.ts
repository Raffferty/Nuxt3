// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/eslint', '@nuxt/icon', '@nuxtjs/sitemap'],
  routeRules: {
    // Generated at build time for SEO purpose
    // Prerenders routes at build time and includes them in your build as static assets
    '/': { prerender: true },

    // posts page generated on demand, cached for 15 sec + 5 sec to revalidate
    // for newly came user after 20 sec does new fetch
    // '/api/posts': { cache: { maxAge: 15, staleMaxAge: 5, swr: true } },

    // posts page generated on demand, cached for 15 sec
    // for newly came user after 15 sec revalidates in background and only next user will see new data
    '/api/posts': { cache: { maxAge: 15, swr: true } },

    // posts/[id] page generated on demand, after fetch is done data is cached for 10 sec and returned without new fetches
    // after 10 sec new fetch is done on demand and is set new cache time for 10 sec
    // maxAge > 0
    '/api/posts/*': { cache: { maxAge: 10, swr: false } },

    // Define server-side redirects: redirection to avoid 404
    '/old-albums': {
      redirect: { to: '/albums', statusCode: 302 },
    },
  },
  icon: {
    provider: 'server',
    customCollections: [
      {
        prefix: 'app-icon',
        dir: './assets/icons',
      },
    ],
  },
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
      title: process.env.NUXT_PUBLIC_APP_NAME,
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
            '@use "@/assets/scss/colors.scss" as *; @use "@/assets/scss/variables.scss" as *; @use "@/assets/scss/mixins.scss" as *; @use "@/assets/scss/input.scss" as *;',
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
      appName: process.env.NUXT_PUBLIC_APP_NAME,
      // the value of baseUrl is taken from process.env.NUXT_PUBLIC_BASE_URL of the served (or built, or generated) .env file
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      baseUrlNuxtApi: process.env.NUXT_BASE_URL_TO_NUXT_API,

      //! the default values will be overriden by appropriate values from .env file served by LOCAL server:
      // for example: nuxt dev --dotenv .env.development.local

      //! when we build the project as SSR for deployment - the default values will be overriden by appropriate values of env vars of the set on the hosting platform (Vercel, Netlify, Docker, etc.)
      //! when we generate the project as SSG for deployment - the default values will be overriden by appropriate values of env vars in generating time, for example: nuxt generate --dotenv .env.production
      theme: 'default-theme', // as we don't have in .env file the key NUXT_PUBLIC_THEME - the default value for theme will be used: 'default-theme'
      apiBase: 'default-api-base', // as we have in .env file the key NUXT_PUBLIC_API_BASE - it's value will override the default value 'default-api-base'

      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
  // visit http://localhost:3000/sitemap.xml to see the generated sitemap.
  /* 
    XML Sitemap
    (L) Nuxt3 Tutorial
    This XML Sitemap contains 7 URLs.

    URL	                                      Images	    Last Updated
    http://127.0.0.1:63531/	                    1	         2025-09-27
    http://127.0.0.1:63531/albums	              0	
    http://127.0.0.1:63531/custom-fetch	        0	
    http://127.0.0.1:63531/profile	            0	
    http://127.0.0.1:61654/posts  	            0	         2025-09-27
    http://127.0.0.1:63531/users	              0	
    // http://127.0.0.1:63531/users/company	    0	                      excluded
    http://127.0.0.1:63531/users/contacts	      0
  */
  site: {
    url: process.env.NUXT_SITE_URL,
    name: process.env.NUXT_SITE_NAME,
    env: process.env.NUXT_SITE_ENV, // See this issue (https://github.com/nuxt/nuxt/issues/19819) on why we can't use process.env.NODE_ENV
    indexable: process.env.NUXT_SITE_ENV === 'production' || process.env.NODE_ENV === 'production',
    trailingSlash: false,
    defaultLocale: 'en',
  },
  // Sitemap Images: https://nuxtseo.com/docs/sitemap/guides/images-videos#sitemap-images
  sitemap: {
    // exclude url /users/company
    exclude: ['/users/company'],
    urls: [
      {
        loc: '/',
        lastmod: '2025-09-27',
        images: [
          {
            loc: 'https://example.com/images/logo.jpg',
            caption: 'My logo',
            geoLocation: 'My logo geo location',
            title: 'My logo title',
            license: 'My logo license',
          },
        ],
      },
      { loc: '/posts', lastmod: '2025-09-27' }, // as pages/posts/[[slug]].vue is dynamic - it is not included to Sitemap, we includ it manually
      // other urls are created from pages index files: pages/albums/index.vue; pages/custom-fetch/index.vue; ...
    ],
  },
})
