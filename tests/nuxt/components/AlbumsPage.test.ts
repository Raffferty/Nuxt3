// we have globals enabled in vitest.config.ts
// import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime'
import type { createPinia } from 'pinia' // Import createPinia from the main 'pinia' package
import { createTestingPinia } from '@pinia/testing'
import { useAlbumsStore } from '@/stores/albums'
import AlbumsPage from '@/pages/albums/index.vue'
import AppButtonText from '@/components/AppButtonText.vue'

// Mock the AppButtonText component used in AlbumsPage
mockComponent('@/components/AppButtonText.vue', {
  template: '<button class="mock-button-text" :disabled="disabled"><slot /></button>',
  props: ['disabled'],
})

// OR
/* vi.mock('@/components/AppButtonText.vue', () => ({
  default: {
    template: '<button class="app-button-text" :disabled="disabled"><slot /></button>',
    props: ['disabled'],
  },
})) */

describe('AlbumsPage.vue', () => {
  // 1. Define a type for the error based on your store's usage (Nuxt/ofetch error structure)
  type MockFetchError = { message: string; statusCode?: number; name: string } | undefined

  let store: ReturnType<typeof useAlbumsStore>
  let pinia: ReturnType<typeof createPinia> // To hold the mocked instance

  // type Album is auto-imported from shared/types/album.ts
  const mockAlbums: Album[] = [
    { id: 1, title: 'Album 1', userId: 1 },
    { id: 2, title: 'Album 2', userId: 2 },
  ]

  // Define state variables outside the main setup
  // This will allow us to easily control their mocked values in each test
  let mockLoading = false
  let mockError: MockFetchError = undefined

  // Helper to find the buttons using the new wrapper type
  const findButton = (wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) =>
    wrapper
      .findAllComponents(AppButtonText)
      .find((w: { text: () => string | string[] }) => w.text().includes(text))?.vm
      .$el as HTMLButtonElement

  beforeEach(() => {
    // 1. Create a Pinia instance using createTestingPinia
    pinia = createTestingPinia({
      // When using Jest, or vitest with globals: true,
      // createTestingPinia automatically stubs actions using the spy function based on the existing test framework (jest.fn or vitest.fn).
      // If you are not using globals: true or using a different framework, you'll need to provide a createSpy option:
      // createSpy: vi.fn,
      initialState: {},
      // Ensure Pinia Testing doesn't automatically stub every action
      stubActions: false,
      // You may need to use `stubActions: false` here if your store actions
      // have internal logic that should be tested, but sticking to spies is safer.
    })

    // 2. Get the mocked store instance
    // Note: When you pass 'pinia' to useAlbumsStore(), it links the store instance
    // to the mocked Pinia environment.
    store = useAlbumsStore(pinia)

    // Reset control variables before each test
    mockLoading = false
    mockError = undefined

    // 2. MOCK READ-ONLY PROPERTIES WITH DYNAMIC GETTERS

    // MOCK 'albums': Use static mockReturnValue since the data doesn't change
    vi.spyOn(store, 'albums', 'get').mockReturnValue(mockAlbums)

    // MOCK 'loading': Use a dynamic mock to return the value of mockLoading
    vi.spyOn(store, 'loading', 'get').mockImplementation(() => mockLoading)

    // MOCK 'error': Use a dynamic mock to return the value of mockError
    vi.spyOn(store, 'error', 'get').mockImplementation(() => mockError)

    // 4. Mock the actions
    // Actions are typically spies/mocks created via createSpy: vi.fn
    store.ensureLoaded = vi.fn()
    store.reloadAlbums = vi.fn()
    store.getError = vi.fn()
    store.clearAlbums = vi.fn()
  })

  // --- Test 1: Initial State (Loaded Albums) ---
  it('renders a list of albums and correct buttons when loaded', async () => {
    // ARRANGE
    // PASS THE MOCKED PINIA INSTANCE TO THE MOUNT FUNCTION
    const wrapper = await mountSuspended(AlbumsPage, {
      global: {
        plugins: [pinia], // Pass the mocked pinia instance here
      },
    })

    // ASSERT
    // Check main title
    expect(wrapper.find('h2').text()).toBe('Albums')

    // Check loading state is NOT visible
    expect(wrapper.text()).not.toContain('Loading...')

    // Check album list (ul) is visible
    const albumItems = wrapper.findAll('li')
    expect(albumItems.length).toBe(2)
    expect(albumItems[0]?.text()).toContain(`title: ${mockAlbums[0]?.title}`)

    // Check buttons are enabled (i.e., disabled prop is false/null)
    const reloadButton = findButton(wrapper, 'Reload')
    const getErrorButton = findButton(wrapper, 'Get Error')
    const clearAlbumsButton = findButton(wrapper, 'Clear Albums')

    // The wrapper for AppButtonText will have a `disabled` prop on its Vue instance
    // or the attribute on the underlying element. We check the element attribute.
    expect(reloadButton.disabled).toBe(false) // Check attribute on the actual button element
    expect(getErrorButton.disabled).toBe(false)
    expect(clearAlbumsButton.disabled).toBe(false)

    // Check ensureLoaded was called on mount
    expect(store.ensureLoaded).toHaveBeenCalledOnce()
  })

  // --- Test 2: Loading State ---
  it('shows Loading... and disables buttons when loading', async () => {
    // ACT: Change the mocked loading state and wait for the DOM update
    mockLoading = true // Change the external variable

    // ARRANGE
    const wrapper = await mountSuspended(AlbumsPage, {
      global: {
        plugins: [pinia], // Pass the mocked pinia instance here
      },
    })

    // Force Vue to re-render the component to pick up the new mocked state
    // await nextTick()

    // ASSERT
    expect(wrapper.find('p').text()).toBe('Loading...')
    expect(wrapper.find('ul').exists()).toBe(false) // Album list should not be visible

    // Check buttons are disabled
    const reloadButton = findButton(wrapper, 'Reload')
    const getErrorButton = findButton(wrapper, 'Get Error')
    const clearAlbumsButton = findButton(wrapper, 'Clear Albums')

    expect(reloadButton.disabled).toBe(true)
    expect(getErrorButton.disabled).toBe(true)

    // The Clear Albums button is visible only if albums.length > 0, even when loading
    // Check if the element was found (it should be an HTML element if it exists)
    expect(clearAlbumsButton).toBeDefined()
  })

  // --- Test 3: Error State ---
  it('shows the error message and hides the "Get Error" button when an error exists', async () => {
    // ARRANGE
    mockLoading = false // Change the external variable
    mockError = { message: 'Failed to fetch', statusCode: 500, name: 'FetchError' } // Mock an error object

    const wrapper = await mountSuspended(AlbumsPage, {
      global: {
        plugins: [pinia], // Pass the mocked pinia instance here
      },
    })

    // Force Vue to re-render the component to pick up the new mocked state
    // await nextTick()

    // ASSERT
    expect(wrapper.find('p').text()).toBe('Error: Failed to fetch')
    expect(wrapper.find('ul').exists()).toBe(false) // Album list should not be visible

    // Check buttons
    const reloadButton = findButton(wrapper, 'Reload')
    const getErrorButton = findButton(wrapper, 'Get Error')
    const clearAlbumsButton = findButton(wrapper, 'Clear Albums')

    expect(reloadButton).toBeDefined() // Should be visible
    expect(reloadButton.disabled).toBe(false)

    expect(clearAlbumsButton).toBeDefined() // Should be visible
    expect(clearAlbumsButton.disabled).toBe(false)

    expect(getErrorButton).toBeUndefined() // v-if="!albumsStore.error" hides it
  })

  // --- Test 4: Button Interactions ---
  it('calls store actions when buttons are clicked', async () => {
    // ARRANGE
    const wrapper = await mountSuspended(AlbumsPage, {
      global: {
        plugins: [pinia], // Pass the mocked pinia instance here
      },
    })

    // Force Vue to re-render the component to pick up the new mocked state
    // await nextTick()

    // console.log(wrapper.html()) // Debugging line to see the rendered output

    // ACT & ASSERT: Reload button
    findButton(wrapper, 'Reload').click()
    expect(store.reloadAlbums).toHaveBeenCalledOnce()

    // ACT & ASSERT: Get Error button
    findButton(wrapper, 'Get Error').click()
    expect(store.getError).toHaveBeenCalledOnce()

    // ACT & ASSERT: Clear Albums button
    findButton(wrapper, 'Clear Albums').click()
    expect(store.clearAlbums).toHaveBeenCalledOnce()
  })
})
