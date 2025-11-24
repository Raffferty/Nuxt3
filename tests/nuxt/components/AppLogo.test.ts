import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppLogo from '@/components/AppLogo.vue'

describe('AppLogo.vue', () => {
  it('renders logo image', async () => {
    const wrapper = await mountSuspended(AppLogo)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/_ipx/s_64x64/images/logo.svg') // Adjust based on your Nuxt image config
    expect(img.attributes('alt')).toBe('logo')
  })
})
