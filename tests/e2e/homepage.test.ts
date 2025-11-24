import { test, expect } from '@nuxt/test-utils/playwright'

test.describe('Home page', () => {
  test('shows Home page Title and default layout heading', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })

    /* const siteName = process.env.NUXT_SITE_NAME

    expect(siteName).toBeDefined()

    await expect(page).toHaveTitle(`${siteName} - Home`) */

    await expect(page).toHaveTitle(/Home/)

    await expect(page.getByRole('heading').first()).toHaveText('Default Layout')
  })
})
