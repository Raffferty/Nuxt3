// we have globals enabled in vitest.config.ts: test: { globals: true } and we setup types in tsconfig.json: "types": ["vitest/globals"]
// see docs: https://vitest.dev/config/#globals
// import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('App', () => {
  it('can mount an app', async () => {
    const component = await mountSuspended(App)
    expect(component).toBeDefined()
  })

  it('App on /albums', async () => {
    const component = await mountSuspended(App, { route: '/albums' })

    // Check for .albums-page element
    const albumsPage = component.find('.albums-page')
    expect(albumsPage.exists()).toBe(true)

    // Optionally, check for the heading inside albums-page
    expect(albumsPage.html()).toContain('<h2>Albums</h2>')
  })
})
