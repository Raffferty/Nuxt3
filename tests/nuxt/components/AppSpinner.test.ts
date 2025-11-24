import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppSpinner from '@/components/AppSpinner.vue'

describe('AppSpinner.vue', () => {
  it('renders spinner with loader', async () => {
    const wrapper = await mountSuspended(AppSpinner)

    const spinner = wrapper.find('.app-spinner')
    expect(spinner.exists()).toBe(true)

    const loader = spinner.find('.loader')
    expect(loader.exists()).toBe(true)
  })
})
