import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import type { createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todo'
import TodosPage from '@/pages/todos/index.vue'

// Mock AppButtonText to a plain button so we can click/inspect disabled
mockComponent('Icon', {
  template: '<span class="mock-icon todos__icon--spinner spinner-color-animation"><slot /></span>',
})

// Mock AppButtonText to a plain button so we can click/inspect disabled
mockComponent('@/components/AppButtonText.vue', {
  template:
    '<button class="mock-button-text" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></button>',
  props: ['disabled'],
  emits: ['click'],
})

// OR
/* vi.mock('@/components/AppButtonText.vue', () => ({
  default: {
    template:
      '<button class="app-button-text" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /></button>',
    props: ['disabled'],
    emits: ['click'],
  },
})) */

// Mock AppInput to a simple input that supports v-model, enter/esc, and optional focus()
mockComponent('@/components/AppInput.vue', {
  props: {
    modelValue: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  emits: ['update:model-value', 'enter', 'esc', 'focus', 'blur'],
  methods: {
    focus() {
      /* no-op for tests */
    },
  },
  template:
    '<div class="mock-app-input">\n' +
    '  <input\n' +
    '    class="mock-app-input__field"\n' +
    '    :disabled="disabled"\n' +
    '    :placeholder="placeholder"\n' +
    '    :value="modelValue"\n' +
    '    @input="$emit(\'update:model-value\', $event.target.value)"\n' +
    '    @keyup.enter="$emit(\'enter\', modelValue)"\n' +
    '    @keyup.esc="$emit(\'esc\', modelValue)"\n' +
    '    @focus="$emit(\'focus\')"\n' +
    '    @blur="$emit(\'blur\')"\n' +
    '  />\n' +
    '</div>',
})

// OR
/* vi.mock('@/components/AppInput.vue', () => ({
  default: {
    props: {
      modelValue: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      placeholder: { type: String, default: '' },
      icon: { type: String, default: '' },
    },
    emits: ['update:model-value', 'enter', 'esc', 'focus', 'blur'],
    methods: {
      focus() {},
    },
    template:
      '<div class="mock-app-input">\n' +
      '  <input\n' +
      '    class="mock-app-input__field"\n' +
      '    :disabled="disabled"\n' +
      '    :placeholder="placeholder"\n' +
      '    :value="modelValue"\n' +
      '    @input="$emit(\'update:model-value\', $event.target.value)"\n' +
      '    @keyup.enter="$emit(\'enter\', modelValue)"\n' +
      '    @keyup.esc="$emit(\'esc\', modelValue)"\n' +
      '    @focus="$emit(\'focus\')"\n' +
      '    @blur="$emit(\'blur\')"\n' +
      '  />\n' +
      '</div>',
  },
})) */

describe('Todos Page (/pages/todos/index.vue)', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useTodoStore>

  // Reusable helper to find a button by contained text
  const findButtonByText = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) =>
    wrapper.findAll('button').find((b: VueWrapper<unknown>) => b.text().includes(text))?.element as
      | HTMLButtonElement
      | undefined

  const mockTodos: Todo[] = [
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
  ]

  let mockLoading = false
  let mockError: string | null = null

  beforeEach(() => {
    pinia = createTestingPinia({
      // When using Jest, or vitest with globals: true,
      // createTestingPinia automatically stubs actions using the spy function based on the existing test framework (jest.fn or vitest.fn).
      // If you are not using globals: true or using a different framework, you'll need to provide a createSpy option:
      // createSpy: vi.fn,
      stubActions: false,
    })

    store = useTodoStore(pinia)

    mockLoading = false
    mockError = null

    vi.spyOn(store, 'todos', 'get').mockReturnValue(mockTodos)
    vi.spyOn(store, 'loading', 'get').mockImplementation(() => mockLoading)
    vi.spyOn(store, 'error', 'get').mockImplementation(() => mockError)

    store.fetchTodos = vi.fn()
    store.addTodo = vi.fn()
    store.updateTodo = vi.fn()
    store.deleteTodo = vi.fn()
  })

  it('renders title and calls fetchTodos on mount', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    expect(wrapper.find('.todos__title').text()).toBe('CRUD Example')
    expect(store.fetchTodos).toHaveBeenCalledOnce()
  })

  it('shows loading spinner when loading is true', async () => {
    mockLoading = true
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    const Icon = wrapper.find('.mock-icon.todos__icon--spinner.spinner-color-animation')

    expect(Icon.exists()).toBe(true)
    expect(Icon.attributes('name')).toContain('app-icon:spinner-wind-toy')
  })

  it('shows error message when error exists', async () => {
    mockError = 'Boom'
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    expect(wrapper.find('.todos__error').text()).toBe('Error: Boom')
  })

  it('disables Add button while loading or when input empty', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    // Initially input is empty => Add disabled
    const addBtn = findButtonByText(wrapper, 'Add')!
    expect(addBtn.disabled).toBe(true)

    // When loading => Add disabled regardless of value
    mockLoading = true
    const wrapperLoading = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })
    const addBtnLoading = findButtonByText(wrapperLoading, 'Add')!
    expect(addBtnLoading.disabled).toBe(true)
  })

  it('adds a new todo using input and Add button', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    const input = wrapper.find('.todos__add-input .mock-app-input__field')
    await input.setValue('New task')

    findButtonByText(wrapper, 'Add')!.click()

    expect(store.addTodo).toHaveBeenCalledWith('New task')
  })

  it('adds a new todo using enter key on input', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    const input = wrapper.find('.todos__add-input .mock-app-input__field')
    await input.setValue('Enter task')
    await input.trigger('keyup.enter')

    expect(store.addTodo).toHaveBeenCalledWith('Enter task')
  })

  it('starts edit mode and disables Save when title unchanged', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    // Click the first Edit
    const editBtn = findButtonByText(wrapper, 'Edit')!
    editBtn.click()

    // Save should be disabled until value changes
    await nextTick()
    const saveBtn = findButtonByText(wrapper, 'Save')!
    expect(saveBtn.disabled).toBe(true)
  })

  it('updates a todo title and exits edit mode on Save', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    // Enter edit for first item
    findButtonByText(wrapper, 'Edit')!.click()
    await nextTick()

    // Change title
    const editInput = wrapper.find('.todos__todo--edit-input .mock-app-input__field')
    await editInput.setValue('Updated Task 1')

    // Save
    findButtonByText(wrapper, 'Save')!.click()

    expect(store.updateTodo).toHaveBeenCalledWith(1, 'Updated Task 1')
  })

  it('cancels edit mode without calling update', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    findButtonByText(wrapper, 'Edit')!.click()
    await nextTick()
    findButtonByText(wrapper, 'Cancel')!.click()

    expect(store.updateTodo).not.toHaveBeenCalled()
  })

  it('deletes a todo when Delete is clicked', async () => {
    const wrapper = await mountSuspended(TodosPage, { global: { plugins: [pinia] } })

    // There are two delete buttons, click the first
    const deleteBtn = findButtonByText(wrapper, 'Delete')!
    deleteBtn.click()

    expect(store.deleteTodo).toHaveBeenCalledWith(1)
  })
})
