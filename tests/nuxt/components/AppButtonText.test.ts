import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppButtonText from '@/components/AppButtonText.vue'

describe('AppButtonText.vue', () => {
  it('renders default slot content', async () => {
    const wrapper = await mountSuspended(AppButtonText, {
      slots: {
        default: () => 'Click Me',
      },
    })

    expect(wrapper.text()).toBe('Click Me')
  })

  it('applies disabled attribute when prop is true', async () => {
    const wrapper = await mountSuspended(AppButtonText, {
      props: {
        disabled: true,
      },
      slots: {
        default: () => 'Disabled Button',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('does not apply disabled attribute when prop is false', async () => {
    const wrapper = await mountSuspended(AppButtonText, {
      props: {
        disabled: false,
      },
      slots: {
        default: () => 'Enabled Button',
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeUndefined()
  })
})
