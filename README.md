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
│   └── middleware/
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

  // But it is OK if we explicitly import even if auto-importing is diabled
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
    checker: true, // for ESLint checking when runing dev server, using `vite-plugin-eslint2` (NOT on the build time!)
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
