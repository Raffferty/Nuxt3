import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppInput from '@/components/AppInput.vue'

describe('AppInput.vue', () => {
  it('renders input field', async () => {
    const wrapper = await mountSuspended(AppInput)

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
  })

  it('binds modelValue to the input', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { modelValue: 'hello' },
    })

    const input = wrapper.find('input')
    expect(input.element.value).toBe('hello')
  })

  it('emits update:model-value on input', async () => {
    const wrapper = await mountSuspended(AppInput)

    const input = wrapper.find('input')
    await input.setValue('world')

    const events = wrapper.emitted('update:model-value')
    // console.log(events) // [ [ 'world' ] ]
    expect(events).toBeTruthy()
    expect(events![0]).toEqual(['world']) // non-null assertion
  })

  it('sets readonly and disabled correctly', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: {
        readonly: true,
        disabled: true,
      },
    })

    /* 
        When you add a boolean HTML attribute like readonly, disabled, or checked,
        the browser renders it as:

        <input readonly>


        But when you inspect its attributes via JS (like el.getAttribute('readonly')),
        you get an empty string ("") — not true.

        That’s because boolean attributes in HTML don’t have values; their presence means true.
    */

    const input = wrapper.find('input')
    // expect(input.attributes()).toHaveProperty('readonly')
    // expect(input.attributes('readonly')).toBeDefined()
    expect(input.element.readOnly).toBe(true)

    // expect(input.attributes()).toHaveProperty('disabled')
    // expect(input.attributes('disabled')).toBeDefined()
    expect(input.element.disabled).toBe(true)
  })

  it('sets default attributes correctly', async () => {
    const wrapper = await mountSuspended(AppInput)

    const input = wrapper.find('input')
    // expect(input.attributes()).not.toHaveProperty('readonly')
    // expect(input.attributes('readonly')).toBeUndefined()
    expect(input.element.readOnly).toBe(false)

    // expect(input.attributes()).not.toHaveProperty('disabled')
    // expect(input.attributes('disabled')).toBeUndefined()
    expect(input.element.disabled).toBe(false)
  })

  it('renders label when provided', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { label: 'Username' },
    })

    expect(wrapper.find('.label').text()).toBe('Username')
  })

  it('uses placeholder when provided', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { placeholder: 'Enter name' },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter name')
  })

  it('emits focus and blur events', async () => {
    const wrapper = await mountSuspended(AppInput)
    const input = wrapper.find('input')

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emits enter and esc events', async () => {
    const wrapper = await mountSuspended(AppInput)
    const input = wrapper.find('input')

    await input.setValue('abc')
    await input.trigger('keyup.enter')
    await input.trigger('keyup.esc')

    expect(wrapper.emitted('enter')?.[0]).toEqual(['abc'])
    expect(wrapper.emitted('esc')?.[0]).toEqual(['abc'])
  })

  it('shows error message when error prop is set', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { error: 'Invalid input' },
    })

    const error = wrapper.find('.error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Invalid input')
  })

  it('shows notes when notes prop is set', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { notes: 'Optional field' },
    })

    const notes = wrapper.find('.notes')
    expect(notes.exists()).toBe(true)
    expect(notes.text()).toBe('Optional field')
  })

  it('adds class based on props', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { disabled: true, readonly: true, error: 'Err' },
    })

    const root = wrapper.find('.app-input')
    expect(root.classes()).toContain('disabled')
    expect(root.classes()).toContain('readonly')
    expect(root.classes()).toContain('error')
  })

  it('renders default slot content', async () => {
    /* 
        If you pass a string like () => '<div class="custom-slot">Extra</div>'
        it will be inserted as text, not compiled HTML, so .custom-slot won’t exist.
        ! Don’t use that if you want an element.
    */
    const SlotComp = defineComponent({
      template: '<div class="custom-slot">Extra</div>',
    })

    const wrapper = await mountSuspended(AppInput, {
      //   slots: { default: () => h('div', { class: 'custom-slot' }, 'Extra') },
      slots: { default: () => h(SlotComp) },
    })

    expect(wrapper.find('.custom-slot').exists()).toBe(true)
  })

  it('renders field and field-after slots', async () => {
    const FieldComp = defineComponent({
      template: '<span class="field-slot">Field</span>',
    })

    const FieldAfterComp = defineComponent({
      template: '<span class="field-after-slot">App</span>',
    })

    const wrapper = await mountSuspended(AppInput, {
      slots: {
        field: () => h(FieldComp),
        'field-after': () => h(FieldAfterComp),
      },
    })

    expect(wrapper.find('.field-slot').exists()).toBe(true)
    expect(wrapper.find('.field-after-slot').exists()).toBe(true)
  })

  it('renders icon element when icon prop is provided', async () => {
    const wrapper = await mountSuspended(AppInput, {
      props: { icon: 'material-symbols:add' },
    })

    // The Icon component renders a span with these classes:
    const icon = wrapper.find('.app-input__icon')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-material-symbols:add')
  })

  it('does not render icon element when icon prop is missing', async () => {
    const wrapper = await mountSuspended(AppInput)
    expect(wrapper.find('.app-input__icon').exists()).toBe(false)
  })
})
