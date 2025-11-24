# Standard Nuxt 3 Project Structure

```ruby
my-nuxt-app/
├── .nuxt/ (auto-generated)
├── assets/
├── components/
├── composables/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── public/
├── server/
│   ├── api/
│   ├── routes/
│   ├── types/
│   ├── middleware/
│   └── utils/
├── shared/
│   ├── types/ ...direct files (not nested dirs) are auto-imported in Vue app and the Nitro server
│   └── utils/ ...direct files (not nested dirs) are auto-imported in Vue app and the Nitro server
├── stores/
├── types/
├── utils/
├── app.vue
├── nuxt.config.ts
├── package.json
├── tsconfig.json
```

# Top-Level Files

| File             | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `app.vue`        | Main app shell (root component) where layouts/pages are rendered. |
| `nuxt.config.ts` | Nuxt configuration file (TypeScript supported by default).        |
| `package.json`   | Project dependencies and scripts.                                 |
| `tsconfig.json`  | TypeScript configuration.                                         |
| `.nuxt/`         | Auto-generated Nuxt build files. Don’t edit manually.             |

# Directories Explained

| Directory            | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| `assets/`            | Uncompiled static assets like SCSS, images, fonts. Not publicly accessible directly. |
| `components/`        | Vue components auto-imported by Nuxt. Supports subdirectories.                       |
| `composables/`       | Composables (like `useXyz`) auto-imported and shared across the app.                 |
| `pages/`             | Vue files here become routes automatically.                                          |
| `layouts/`           | Custom layouts for pages (e.g., `default.vue`, `admin.vue`).                         |
| `middleware/`        | Route middleware (client-side navigation guards).                                    |
| `plugins/`           | Client/server plugins that run before app mounts.                                    |
| `public/`            | Static files served as-is (e.g., images, robots.txt). Accessible via `/`.            |
| `server/api/`        | API routes (server-side only, becomes `/api/*`).                                     |
| `shared/`            | /types and /utils direct files are auto-imported in Vue app and the Nitro server     |
| `server/middleware/` | Server middleware like authentication or custom handlers.                            |
| `utils/` (optional)  | Utility functions (not auto-imported by default).                                    |
| `types/` (optional)  | Type definitions and interfaces.                                                     |

# Notes

- Routing: pages/ defines routing automatically using file names.

- Auto-Imports: components/, composables/, and utils/ (with config) can be auto-imported.

- API Routes: Placed in server/api/, and follow file-based routing too.

- Middlewares:
  - middleware/ → client-side.

  - server/middleware/ → server-side

- in [nuxt.config.ts](./nuxt.config.ts) we can disable auto-importing:

```ts
export default defineNuxtConfig({
  // disable auto-importing composables and utilities
  // This will disable auto-imports completely but it's still possible to use explicit imports from #imports.
  imports: {
    autoImport: false,
  },

  // disable auto-importing components from your own ~/components directory
  components: {
    dirs: [],
  },

  // But it is OK if we explicitly import even if auto-importing is disabled
})
```

# Type-checking

- By default, Nuxt doesn't check types when you run nuxt dev or nuxt build, for performance reasons.
  To enable type-checking at build or development time, install vue-tsc and typescript as development dependency:

```sh
npm install --save-dev vue-tsc typescript
```

- Nuxt’s built-in type checking slows down hot-reload a bit
  A faster pattern is:
  Dev mode: Run Nuxt with typeCheck: false (no blocking on reloads). - in defineNuxtConfig: typeCheck: process.env.NODE_ENV === 'production'
  Parallel type check: Run "vue-tsc --noEmit --skipLibCheck --watch" (script: "typecheck-watch") in another terminal.

```json
"scripts": {
  "typecheck": "nuxt typecheck",
  "typecheck-watch": "vue-tsc --noEmit --skipLibCheck --watch"
},
```

```ts
export default defineNuxtConfig({
  typescript: {
    typeCheck: process.env.NODE_ENV === 'production',
  },
})
```

# Nuxt CLI commands (scripts):

```json
"scripts": {
  "build": "nuxt build",
  "generate": "nuxt generate",
  "preview": "nuxt preview",
  "postinstall": "nuxt prepare"
},
```

- `"build": "nuxt build"`
  - Purpose: Builds your Nuxt app for production.
  - **What it does**:
    - Runs Vite’s build process.
    - Generates optimized JS/CSS chunks, HTML templates, and server output (for SSR).
    - If you’re using SSR mode, produces a `.output` folder with server and client bundles.
    - Runs type checking if `typescript.typeCheck: true`.
    - Generates optimized JS/CSS chunks, HTML templates, and server output (for SSR).
  - **When to use**: Before deploying to production, or in CI/CD pipelines.

- `"generate": "nuxt generate"`
  - Purpose: Pre-renders your site into static HTML (SSG mode).
  - **What it does**:
    - Runs a production build.
    - Visits every route (from `pages/` and `nitro.prerender.routes config`) and generates HTML files.
    - Produces a `dist/` folder ready to be served by any static hosting (Netlify, GitHub Pages, etc.).
  - **When to use**: If you want a static site with no Node server needed.

- `"preview": "nuxt preview"`
  - Purpose: Serves a built app locally to preview the production result.
  - **What it does**:
    - Starts a local server using the .output (SSR) or dist (SSG) folder from a previous nuxt build or nuxt generate.
    - Doesn’t rebuild — just serves what’s already built.
  - **When to use**: To test the exact production build locally before deploying.

- `"postinstall": "nuxt prepare"`
  - Purpose: Runs after npm `install` automatically (because of the `postinstall` hook).
  - **What it does**:
    - Prepares Nuxt’s internal type generation (e.g., `nuxt.d.ts`).
    - Ensures `.nuxt/` folder has the correct type definitions for IDE autocompletion.
    - Doesn’t build your app — just sets up dev-time tooling.
  - **When to use**: You usually **don’t run it manually** — it’s there so every time dependencies are installed, Nuxt is ready for dev immediately.

# ESLint Module [(docs)](https://eslint.nuxt.com/packages/module)

- Quick Setup:

```sh
npx nuxt module add eslint
```

- install extra dependencies `vite-plugin-eslint2` for Vite

```sh
npm i -D vite-plugin-eslint2
```

- configs in `eslint.config.mjs`

```ts
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
```

- ESLint configs in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  eslint: {
    // options here
    checker: true, // for ESLint checking when running dev server, using `vite-plugin-eslint2` (NOT on the build time!)
  },
})
```

- ESLint scripts in package.json

```json
"scripts": {
  "build": "eslint . && nuxt build", // to check ESLint before the build
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
},
```

# Suppress console.logs on production mode in `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  vite: {
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
})
```

# .env files and runtimeConfig

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // runtimeConfig values can be accessed by useRuntimeConfig(), for example: useRuntimeConfig().public.baseUrl

    // keys in runtimeConfig => keys in .env :=> apiSecret = env.NUXT_API_SECRET
    apiSecret: process.env.NUXT_API_SECRET, // ! as apiSecret is Not public - it can be accessed ONLY on SERVER side by useRuntimeConfig().apiSecret

    // public.baseUrl = env.NUXT_PUBLIC_BASE_URL
    // public.theme = env.NUXT_PUBLIC_THEME
    // public.apiBase = NUXT_PUBLIC_API_BASE
    public: {
      // the value of baseUrl is taken from process.env.NUXT_PUBLIC_BASE_URL of the served (or built, or generated) .env file
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,

      //! the default values will be overridden by appropriate values from .env file served by LOCAL server:
      // for example: nuxt dev --dotenv .env.development.local

      //! when we build the project as SSR for deployment - the default values will be overridden by appropriate values of env vars of the set on the hosting platform (Vercel, Netlify, Docker, etc.)
      //! when we generate the project as SSG for deployment - the default values will be overridden by appropriate values of env vars in generating time, for example: nuxt generate --dotenv .env.production
      theme: 'default-theme', // as we don't have in .env file the key NUXT_PUBLIC_THEME - the default value for theme will be used: 'default-theme'
      apiBase: 'default-api-base', // as we have in .env file the key NUXT_PUBLIC_API_BASE - it's value will override the default value 'default-api-base'
    },
  },
})
```

# import.meta and process.env

`import.meta.env.MODE` => development / production
`import.meta.env.DEV` => false / true
`import.meta.env.PROD` => false / true

`import.meta.client` => false / true
`import.meta.server` => false / true
`import.meta.dev` => false / true

`process.env.NUXT_API_SECRET` => undefined on client side
`process.env.NUXT_PUBLIC_API_BASE` => undefined on client side

# Add styling to Markdown Preview Enhanced [=>](https://shd101wyy.github.io/markdown-preview-enhanced/#/customize-css)

- Open MPE custom style file
  - In VS Code, open Command Palette (Ctrl+Shift+P / Cmd+Shift+P on Mac).

  - Run Markdown Preview Enhanced: Customize CSS.
  - → This will open (or create) a style.less file for MPE.

- Add CSS override:

```css
.markdown-preview.markdown-preview {
  // modify your style here
  // eg: background-color: blue;
}

.md-sidebar-toc.md-sidebar-toc {
  // sidebar TOC style
  width: 600px !important;

  bold-red {
    color: red;
    font-weight: bold;
  }
}
```

# Nuxt Composables

## [onPrehydrate](https://nuxt.com/docs/3.x/api/composables/on-prehydrate)

- to run a callback on the client immediately before Nuxt hydrates the page.

## [useAppConfig](https://nuxt.com/docs/3.x/api/composables/use-app-config)

- access the reactive app config defined in the project.

## [<bold-red>useAsyncData</bold-red>](https://nuxt.com/docs/3.x/api/composables/use-async-data)

- Provides access to data that resolves asynchronously in an SSR-friendly composable.
- Blocks the navigation if used with `await` and blocks initial page loading (no matter the `await`).
- **_useAsyncData_** is a composable meant to be called directly in the Nuxt context.
- It returns reactive composables and handles adding responses to the Nuxt payload so they can be passed from server to client **_without re-fetching_** the data on client side when the page hydrates.
- **By default, useAsyncData blocks navigation** until its async handler is resolved.

## [useCookie](https://nuxt.com/docs/3.x/api/composables/use-cookie)

- is an SSR-friendly composable to read and write cookies.

## [useError](https://nuxt.com/docs/3.x/api/composables/use-error)

- returns the global Nuxt error that is being handled.

## [<bold-red>useFetch</bold-red>](https://nuxt.com/docs/3.x/api/composables/use-fetch)

-fetch data from an API endpoint with an SSR-friendly composable.

- Blocks the navigation if used with `await` and blocks initial page loading (no matter the `await`).
- **_useFetch_** is a composable meant to be called directly in a setup function, plugin, or route middleware.
- It returns reactive composables and handles adding responses to the Nuxt payload so they can be passed from server to client **_without re-fetching_** the data on client side when the page hydrates.
- **By default, useFetch blocks navigation** until its async handler is resolved.

## [useHead](https://nuxt.com/docs/3.x/api/composables/use-head)

- customizes the head properties of individual pages of your Nuxt app.

## [useHeadSafe](https://nuxt.com/docs/3.x/api/composables/use-head-safe)

- the recommended way to provide head data with user input.

## [useHydration](https://nuxt.com/docs/3.x/api/composables/use-hydration)

- allows full control of the hydration cycle to set and receive data from the server.

## [<bold-red>useLazyAsyncData</bold-red>](https://nuxt.com/docs/3.x/api/composables/use-lazy-async-data)

- this wrapper around useAsyncData, doesn't respect `await`, triggers navigation immediately.
- Except on INITIAL `(SSR)` loading! To not block initial page loading with useLazyFetch should be set `{ server: false }`
- **_useLazyAsyncData_** provides a wrapper around `useAsyncData` that **triggers navigation before the handler is resolved.**

## [<bold-red>useLazyFetch</bold-red>](https://nuxt.com/docs/3.x/api/composables/use-lazy-fetch)

- this wrapper around useFetch, doesn't respect `await`, triggers navigation immediately.
- Except on INITIAL `(SSR)` loading! To not block initial page loading with useLazyFetch should be set `{ server: false }`
- **_useLazyFetch_** provides a wrapper around `useFetch` that **triggers navigation before the handler is resolved.**

## [useLoadingIndicator](https://nuxt.com/docs/3.x/api/composables/use-loading-indicator)

- this composable gives you access to the loading state of the app page.

## [useNuxtApp](https://nuxt.com/docs/3.x/api/composables/use-nuxt-app)

- access the shared runtime context of the Nuxt Application.

## [<bold-red>useNuxtData</bold-red>](https://nuxt.com/docs/3.x/api/composables/use-nuxt-data)

- access the current cached value of data fetching composables.
- **_useNuxtData_** gives you access to the current cached value of `useAsyncData`, `useLazyAsyncData`, `useFetch` and `useLazyFetch` with explicitly provided key.
- To use `useNuxtData`, ensure that the data-fetching composable (`useFetch`, `useAsyncData`, etc.) has been called with an explicitly provided key.

## [usePreviewMode](https://nuxt.com/docs/3.x/api/composables/use-preview-mode)

- to check and control preview mode in Nuxt.

## [useRequestEvent](https://nuxt.com/docs/3.x/api/composables/use-request-event)

- access the incoming request event with the useRequestEvent composable.

## [useRequestFetch](https://nuxt.com/docs/3.x/api/composables/use-request-fetch)

- forward the request context and headers for server-side fetch requests.

## [useRequestHeader](https://nuxt.com/docs/3.x/api/composables/use-request-header)

- to access a certain incoming request header.

## [useRequestHeaders](https://nuxt.com/docs/3.x/api/composables/use-request-headers)

- to access the incoming request headers.

## [useRequestURL](https://nuxt.com/docs/3.x/api/composables/use-request-url)

- access the incoming request URL.

## [useResponseHeader](https://nuxt.com/docs/3.x/api/composables/use-response-header)

- to set a server response header.

## [useRoute](https://nuxt.com/docs/3.x/api/composables/use-route)

- returns the current route.

## [useRouteAnnouncer](https://nuxt.com/docs/3.x/api/composables/use-route-announcer)

- observes the page title changes and updates the announcer message accordingly.

## [useRouter](https://nuxt.com/docs/3.x/api/composables/use-router)

- returns the router instance.

## [useRuntimeConfig](https://nuxt.com/docs/3.x/api/composables/use-runtime-config)

- access runtime config variables.

## [useRuntimeHook](https://nuxt.com/docs/3.x/api/composables/use-runtime-hook)

- registers a runtime hook in a Nuxt application and ensures it is properly disposed of when the scope is destroyed.

## [useSeoMeta](https://nuxt.com/docs/3.x/api/composables/use-seo-meta)

- lets you define your site's SEO meta tags as a flat object with full TypeScript support.

## [useServerSeoMeta](https://nuxt.com/docs/3.x/api/composables/use-server-seo-meta)

- lets you define your site's SEO meta tags as a flat object with full TypeScript support.

## [useState](https://nuxt.com/docs/3.x/api/composables/use-state)

- creates a reactive and SSR-friendly shared state.

# Nuxt Utils

## [<bold-red>\$fetch</bold-red>](https://nuxt.com/docs/3.x/api/utils/dollarfetch)

- to expose globally the $fetch helper for making HTTP requests.
- Using \$fetch in components without wrapping it with useAsyncData causes fetching the data twice: initially on the server, then again on the client-side during hydration, because $fetch does not transfer state from the server to the client. Thus, the fetch will be executed on both sides because the client has to get the data again.

## [abortNavigation](https://nuxt.com/docs/3.x/api/utils/abort-navigation)

- is a helper function that prevents navigation from taking place and throws an error if one is set as a parameter.

## [addRouteMiddleware](https://nuxt.com/docs/3.x/api/utils/add-route-middleware)

- is a helper function to dynamically add middleware in your application.

## [callOnce](https://nuxt.com/docs/3.x/api/utils/call-once)

- Run a given function or block of code once during SSR or CSR.

## [clearError](https://nuxt.com/docs/3.x/api/utils/clear-error)

- The clearError composable clears all handled errors.

## [clearNuxtData](https://nuxt.com/docs/3.x/api/utils/clear-nuxt-data)

- Delete cached data, error status and pending promises of useAsyncData and useFetch.

## [clearNuxtState](https://nuxt.com/docs/3.x/api/utils/clear-nuxt-state)

- Delete the cached state of useState.

## [createError](https://nuxt.com/docs/3.x/api/utils/create-error)

- Create an error object with additional metadata.

## [defineLazyHydrationComponent](https://nuxt.com/docs/3.x/api/utils/define-lazy-hydration-component)

- Define a lazy hydration component with a specific strategy.

## [defineNuxtComponent](https://nuxt.com/docs/3.x/api/utils/define-nuxt-component)

- defineNuxtComponent() is a helper function for defining type safe components with Options API.

## [<bold-red>defineNuxtPlugin</bold-red>](https://nuxt.com/docs/3.x/api/utils/define-nuxt-plugin)

- defineNuxtPlugin() is a helper function for creating Nuxt plugins.
- Nuxt automatically reads the files in the plugins/ directory and loads them at the creation of the Vue application.

### Object Syntax Plugins

```js
export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre', // or 'post'
  async setup(nuxtApp) {
    // this is the equivalent of a normal functional plugin
  },
  hooks: {
    // You can directly register Nuxt app runtime hooks here
    'app:created'() {
      const nuxtApp = useNuxtApp()
      // do something in the hook
    },
  },
  env: {
    // Set this value to `false` if you don't want the plugin to run when rendering server-only or island components.
    islands: true,
  },
})
```

### Function Syntax Plugins

```js
export default defineNuxtPlugin(() => {
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`
    }
  }
})
```

### Using in component

```js
const { $hello } = useNuxtApp()
```

## [defineNuxtRouteMiddleware](https://nuxt.com/docs/3.x/api/utils/define-nuxt-route-middleware)

- Create named route middleware using defineNuxtRouteMiddleware helper function.

## [definePageMeta](https://nuxt.com/docs/3.x/api/utils/define-page-meta)

- Define metadata for your page components.

## [defineRouteRules](https://nuxt.com/docs/3.x/api/utils/define-route-rules)

- Define route rules for hybrid rendering at the page level.

## [navigateTo](https://nuxt.com/docs/3.x/api/utils/navigate-to)

- is a helper function that programmatically navigates users.

## [onBeforeRouteLeave](https://nuxt.com/docs/3.x/api/utils/on-before-route-leave)

- The onBeforeRouteLeave composable allows registering a route guard within a component.

## [onNuxtReady](https://nuxt.com/docs/3.x/api/utils/on-nuxt-ready)

- The onNuxtReady composable allows running a callback after your app has finished initializing.

## [prefetchComponents](https://nuxt.com/docs/3.x/api/utils/prefetch-components)

- Nuxt provides utilities to give you control over prefetching components.

## [preloadComponents](https://nuxt.com/docs/3.x/api/utils/preload-components)

- Nuxt provides utilities to give you control over preloading components.

## [preloadRouteComponents](https://nuxt.com/docs/3.x/api/utils/preload-route-components)

- preloadRouteComponents allows you to manually preload individual pages in your Nuxt app.

## [prerenderRoutes](https://nuxt.com/docs/3.x/api/utils/prerender-routes)

- prerenderRoutes hints to Nitro to prerender an additional route.

## [refreshCookie](https://nuxt.com/docs/3.x/api/utils/refresh-cookie)

- Refresh useCookie values manually when a cookie has changed.

## [refreshNuxtData](https://nuxt.com/docs/3.x/api/utils/refresh-nuxt-data)

- Refresh all or specific asyncData instances in Nuxt.

## [reloadNuxtApp](https://nuxt.com/docs/3.x/api/utils/reload-nuxt-app)

- reloadNuxtApp will perform a hard reload of the page.

## [setPageLayout](https://nuxt.com/docs/3.x/api/utils/set-page-layout)

- setPageLayout allows you to dynamically change the layout of a page.

## [setResponseStatus](https://nuxt.com/docs/3.x/api/utils/set-response-status)

- sets the statusCode (and optionally the statusMessage) of the response.

## [showError](https://nuxt.com/docs/3.x/api/utils/show-error)

- Nuxt provides a quick and simple way to show a full screen error page if needed.

## [updateAppConfig](https://nuxt.com/docs/3.x/api/utils/update-app-config)

- Update the App Config at runtime.

# Testing

## [docs](https://nuxt.com/docs/3.x/getting-started/testing)

```sh
npm i --save-dev @nuxt/test-utils vitest @vue/test-utils happy-dom playwright-core
```

## If you have Pinia:

```sh
npm i -D @pinia/testing
```

# Unit Testing

## [docs](https://nuxt.com/docs/3.x/getting-started/testing#unit-testing)

1. Add `@nuxt/test-utils/module` to your `nuxt.config` file (optional).
   It adds a Vitest integration to your Nuxt DevTools which supports running your unit tests in development.

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/test-utils/module'],
})
```

2. Create a `vitest.config.ts` with the following content:

```ts
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          globals: true, // to not import 'vitest/globals' in every test file
          name: 'unit',
          include: ['tests/unit/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          globals: true, // to not import 'vitest/globals' in every test file
          name: 'nuxt',
          include: [
            'tests/nuxt/{components,composables,store}/**/*.{test,spec}.ts',
            'tests/nuxt/server/**/*.{test,spec}.ts',
          ],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
```

3. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Using Vitest projects, you have fine-grained control over which tests run in which environment:

**Unit tests**: Place regular unit tests in test/unit/ - these run in a Node environment for speed
**Nuxt tests**: Place tests that rely on the Nuxt runtime environment in test/nuxt/ - these will run within a Nuxt runtime environment

## Organizing Your Tests

**from vitest.config.ts**

- nuxt/ => environment: 'nuxt'
- unit/ => environment: 'node'

- **e2e/ => will run with Playwright Test Runner after @playwright/test installation**

```ruby
test/
├── e2e/
│ └── homepage.test.ts
├── nuxt/
│ ├── components/
│ │  └── Component.test.ts
│ └── composables/
│ │ └── composables/
│ └── server/
│ | └── api/
│ |    └── index.get.test.ts
│ └── store/
│   └── todo.test.ts
├── unit/
│ └── utils.test.ts
```

## Running Tests **with Vitest**

#### Run all tests

```sh
npx vitest run
```

#### Run only unit tests

```sh
npx vitest run --project unit
```

#### Run only Nuxt tests

```sh
npx vitest run --project nuxt
```

#### Run tests in watch mode

```sh
npx vitest --watch
```

## `package.json` test `scripts`

```json
"scripts": {
  "test": "vitest run", // runs the tests without watching
  "test:watch": "vitest --watch", // runs the tests with watching
  "test:preview": "vite preview --outDir vitest-ui", // preview the tests from vitest-ui folder (no watching) in Vitest UI
  "test:ui": "vitest --watch --ui", // runs tests in watch mode and prview the results in Vitest UI
  "test:nuxt": "vitest run --project nuxt", // runs without watching under the tests/nuxt folder (vitest.config.ts project.test.name = 'nuxt')
  "test:nuxt:watch": "vitest --watch --project nuxt", // runs with watching under the tests/nuxt folder (vitest.config.ts project.test.name = 'nuxt')
  "test:unit": "vitest run --project unit", // runs without watching under the tests/{e2e,unit} folder (vitest.config.ts project.test.name = 'unit')
  "test:unit:watch": "vitest --watch --project unit", // runs with watching under the tests/{e2e,unit} folder (vitest.config.ts project.test.name = 'unit')
  "coverage": "vitest run --coverage" // runs the coverage without Vitest UI (shows the result in the Terminal)
}
```

## You can use npm run test command with testFile name (if it is uniq):

```sh
npm run test AppButtonText.test.ts
```

## Or with the path to the file:

```sh
npm run test tests/nuxt/components/AppButtonText.test.ts
```

# e2e Testing with Playwright Test Runner

[docs](https://nuxt.com/docs/3.x/getting-started/testing#testing-with-playwright-test-runner)

installation:

```bash
npm i --save-dev @playwright/test @nuxt/test-utils
```

then (to install browsers):

```bash
npx playwright install
```

[create playwright.config.ts](https://github.com/nuxt/test-utils/blob/main/examples/app-playwright/playwright.config.ts)
where we have: `testDir: 'tests/e2e'`

**Playwright runs outside of Nuxt, so .env files aren’t automatically loaded**
**Add `dotenv-cli` package** to run "e2e" script with the appropriate .env vars:

```bash
npm i -D dotenv-cli
```

Add `"e2e"` scripts to package.json

```json
"scripts": {
  "e2e": "npx dotenv -e .env.development.local -- npx playwright test",
  "e2e:prod": "npx dotenv -e .env.production -- npx playwright test",
  "e2e:report": "playwright show-report"
}
```

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
