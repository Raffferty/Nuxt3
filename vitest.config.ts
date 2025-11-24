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
    reporters: ['default', 'html'],
    outputFile: './vitest-ui/index.html',
    coverage: {
      enabled: true,
      reportsDirectory: './vitest-ui/coverage',
      provider: 'v8', // or 'istanbul'
      include: [
        '{components,composables,layouts,middleware,pages,plugins,shared,store,utils}/**/*.{vue,ts}',
        'server/**/*.ts',
      ],
      exclude: ['shared/types/**/*.ts'],
    },
  },
})
