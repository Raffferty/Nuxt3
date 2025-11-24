import { createTestingPinia } from '@pinia/testing'
import type { createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todo'

describe('Todo Store (stores/todo.ts)', () => {
  let pinia: ReturnType<typeof createPinia>
  let store: ReturnType<typeof useTodoStore>
  // const original$fetch: typeof global.$fetch = global.$fetch

  const mockTodos: Todo[] = [
    { id: 1, title: 'Task 1' },
    { id: 2, title: 'Task 2' },
    { id: 3, title: 'Task 3' },
  ]

  // Helper function to set mock $fetch
  /* const setMock$fetch = (mockFn: ReturnType<typeof vi.fn>) => {
    global.$fetch = mockFn as unknown as typeof global.$fetch
  } */

  // Helper function to stub global $fetch
  // we can mock a global variable $fetch to test different cases
  const stubGlobal$fetch = (mockFn: ReturnType<typeof vi.fn>) => {
    vi.stubGlobal('$fetch', mockFn)
  }

  beforeEach(() => {
    pinia = createTestingPinia({
      // When using Jest, or vitest with globals: true,
      // createTestingPinia automatically stubs actions using the spy function based on the existing test framework (jest.fn or vitest.fn).
      // If you are not using globals: true or using a different framework, you'll need to provide a createSpy option:
      // createSpy: vi.fn,
      stubActions: false, // Don't stub actions so we can test the actual implementation
    })

    store = useTodoStore(pinia)
  })

  afterEach(() => {
    // Restore the original $fetch function
    // global.$fetch = original$fetch

    vi.clearAllMocks()

    // resetting the stubbed globals
    vi.unstubAllGlobals()
  })

  describe('Initial State', () => {
    it('should initialize with empty arrays and null values', () => {
      expect(store.todos).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchTodos', () => {
    it('should fetch todos successfully', async () => {
      const $fetchSpy = vi.fn().mockResolvedValue(mockTodos)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.fetchTodos()

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos')
      expect(store.todos).toEqual(mockTodos)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading to true while fetching', async () => {
      let resolvePromise: (value: Todo[]) => void
      const promise = new Promise<Todo[]>((resolve) => {
        resolvePromise = resolve
      })
      const $fetchSpy = vi.fn().mockReturnValue(promise)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      const fetchPromise = store.fetchTodos()

      // Check that loading is true during fetch
      expect(store.loading).toBe(true)
      expect(store.error).toBeNull()

      // Resolve the promise
      resolvePromise!(mockTodos)
      await fetchPromise

      expect(store.loading).toBe(false)
    })

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to fetch todos'
      const $fetchSpy = vi.fn().mockRejectedValue(new Error(errorMessage))
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.fetchTodos()

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos')
      expect(store.todos).toEqual([])
      expect(store.error).toBe(errorMessage)
      expect(store.loading).toBe(false)
    })

    it('should clear previous error when fetching', async () => {
      // Set an initial error
      store.error = 'Previous error'
      const $fetchSpy = vi.fn().mockResolvedValue(mockTodos)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.fetchTodos()

      expect(store.error).toBeNull()
      expect(store.todos).toEqual(mockTodos)
    })
  })

  describe('addTodo', () => {
    it('should add a new todo successfully', async () => {
      const newTodo: Todo = { id: 4, title: 'New Task' }
      const $fetchSpy = vi.fn().mockResolvedValue(newTodo)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.addTodo('New Task')

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        body: { title: 'New Task' },
      })
      expect(store.todos).toContainEqual(newTodo)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading to true while adding', async () => {
      let resolvePromise: (value: Todo) => void
      const promise = new Promise<Todo>((resolve) => {
        resolvePromise = resolve
      })
      const $fetchSpy = vi.fn().mockReturnValue(promise)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      // First add some initial todos
      store.todos = [...mockTodos]

      const addPromise = store.addTodo('New Task')

      // Check that loading is true during add
      expect(store.loading).toBe(true)
      expect(store.error).toBeNull()

      // Resolve the promise
      const newTodo = { id: 4, title: 'New Task' }
      resolvePromise!(newTodo)
      await addPromise

      expect(store.loading).toBe(false)
      expect(store.todos).toHaveLength(4)
    })

    it('should handle add todo errors', async () => {
      const errorMessage = 'Failed to add todo'
      const $fetchSpy = vi.fn().mockRejectedValue(new Error(errorMessage))
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      // Set initial todos
      store.todos = [...mockTodos]
      const initialLength = store.todos.length

      await store.addTodo('New Task')

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos', {
        method: 'POST',
        body: { title: 'New Task' },
      })
      expect(store.todos).toHaveLength(initialLength)
      expect(store.error).toBe(errorMessage)
      expect(store.loading).toBe(false)
    })

    it('should clear previous error when adding', async () => {
      // Set an initial error
      store.error = 'Previous error'
      store.todos = [...mockTodos]

      const newTodo: Todo = { id: 4, title: 'New Task' }
      const $fetchSpy = vi.fn().mockResolvedValue(newTodo)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.addTodo('New Task')

      expect(store.error).toBeNull()
    })
  })

  describe('updateTodo', () => {
    it('should update an existing todo successfully', async () => {
      store.todos = [...mockTodos]
      const updatedTodo: Todo = { id: 2, title: 'Updated Task 2' }
      const $fetchSpy = vi.fn().mockResolvedValue(updatedTodo)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.updateTodo(2, 'Updated Task 2')

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos?id=2', {
        method: 'PUT',
        body: { title: 'Updated Task 2' },
      })
      expect(store.todos[1]).toEqual(updatedTodo)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should not update todo if id not found', async () => {
      store.todos = [...mockTodos]
      const updatedTodo: Todo = { id: 999, title: 'Updated Non-existent' }
      const $fetchSpy = vi.fn().mockResolvedValue(updatedTodo)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      const initialTodos = [...store.todos]

      await store.updateTodo(999, 'Updated Non-existent')

      expect(store.todos).toEqual(initialTodos)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading to true while updating', async () => {
      let resolvePromise: (value: Todo) => void
      const promise = new Promise<Todo>((resolve) => {
        resolvePromise = resolve
      })
      const $fetchSpy = vi.fn().mockReturnValue(promise)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      store.todos = [...mockTodos]

      const updatePromise = store.updateTodo(2, 'Updated Task 2')

      // Check that loading is true during update
      expect(store.loading).toBe(true)
      expect(store.error).toBeNull()

      // Resolve the promise
      const updatedTodo: Todo = { id: 2, title: 'Updated Task 2' }
      resolvePromise!(updatedTodo)
      await updatePromise

      expect(store.loading).toBe(false)
    })

    it('should handle update todo errors', async () => {
      store.todos = [...mockTodos]
      const errorMessage = 'Failed to update todo'
      const $fetchSpy = vi.fn().mockRejectedValue(new Error(errorMessage))
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      const initialTodos = [...store.todos]

      await store.updateTodo(2, 'Updated Task 2')

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos?id=2', {
        method: 'PUT',
        body: { title: 'Updated Task 2' },
      })
      expect(store.todos).toEqual(initialTodos)
      expect(store.error).toBe(errorMessage)
      expect(store.loading).toBe(false)
    })

    it('should clear previous error when updating', async () => {
      // Set an initial error
      store.error = 'Previous error'
      store.todos = [...mockTodos]

      const updatedTodo: Todo = { id: 2, title: 'Updated Task 2' }
      const $fetchSpy = vi.fn().mockResolvedValue(updatedTodo)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.updateTodo(2, 'Updated Task 2')

      expect(store.error).toBeNull()
    })
  })

  describe('deleteTodo', () => {
    it('should delete a todo successfully', async () => {
      store.todos = [...mockTodos]
      const $fetchSpy = vi.fn().mockResolvedValue({})
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.deleteTodo(2)

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos?id=2', {
        method: 'DELETE',
      })
      expect(store.todos).toHaveLength(2)
      expect(store.todos.find((t) => t.id === 2)).toBeUndefined()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should set loading to true while deleting', async () => {
      let resolvePromise: (value: unknown) => void
      const promise = new Promise<unknown>((resolve) => {
        resolvePromise = resolve
      })
      const $fetchSpy = vi.fn().mockReturnValue(promise)
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      store.todos = [...mockTodos]

      const deletePromise = store.deleteTodo(2)

      // Check that loading is true during delete
      expect(store.loading).toBe(true)
      expect(store.error).toBeNull()

      // Resolve the promise
      resolvePromise!({})
      await deletePromise

      expect(store.loading).toBe(false)
    })

    it('should handle delete todo errors', async () => {
      store.todos = [...mockTodos]
      const errorMessage = 'Failed to delete todo'
      const $fetchSpy = vi.fn().mockRejectedValue(new Error(errorMessage))
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      const initialTodos = [...store.todos]

      await store.deleteTodo(2)

      expect($fetchSpy).toHaveBeenCalledWith('/api/todos?id=2', {
        method: 'DELETE',
      })
      expect(store.todos).toEqual(initialTodos)
      expect(store.error).toBe(errorMessage)
      expect(store.loading).toBe(false)
    })

    it('should clear previous error when deleting', async () => {
      // Set an initial error
      store.error = 'Previous error'
      store.todos = [...mockTodos]

      const $fetchSpy = vi.fn().mockResolvedValue({})
      // setMock$fetch($fetchSpy)

      stubGlobal$fetch($fetchSpy)

      await store.deleteTodo(2)

      expect(store.error).toBeNull()
    })
  })
})
