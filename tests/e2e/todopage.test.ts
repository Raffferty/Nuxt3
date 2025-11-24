import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Todos page', () => {
  // Using Test Hooks
  test.beforeEach(async ({ page, goto }) => {
    // Go to the starting url before each test.
    await goto('/', { waitUntil: 'hydration' })
    // And navigate to the Todos page
    const todosLink = page.getByRole('link', { name: 'Todos' })
    await todosLink.click()
  })

  test('shows Todos page Title and default layout heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Todos/)

    await expect(page.getByRole('heading').first()).toHaveText('Default Layout')
  })

  test('shows Todos page "CRUD Example" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /CRUD Example/i })).toBeVisible({
      timeout: 10000,
    })
  })
})
