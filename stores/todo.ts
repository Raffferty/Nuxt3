import { defineStore } from 'pinia'

// type Todo is auto-imported from shared/types/todos.ts
export const useTodoStore = defineStore('todo', () => {
  // state
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // actions
  async function fetchTodos() {
    console.log('actions fetchTodos')

    loading.value = true
    error.value = null

    try {
      todos.value = await $fetch<Todo[]>('/api/todos')
    } catch (err: unknown) {
      // extractErrorMessage() is auto-imported from shared/utils/extractErrorMessage.ts
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    console.log('actions addTodo')

    loading.value = true
    error.value = null

    try {
      const newItem = await $fetch<Todo>('/api/todos', {
        method: 'POST',
        body: { title },
      })

      todos.value.push(newItem)
    } catch (err: unknown) {
      // extractErrorMessage() is auto-imported from shared/utils/extractErrorMessage.ts
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function updateTodo(id: number, title: string) {
    console.log('actions updateTodo')

    loading.value = true
    error.value = null

    try {
      const updated = await $fetch<Todo>(`/api/todos?id=${id}`, {
        method: 'PUT',
        body: { title },
      })

      const index = todos.value.findIndex((t) => t.id === id)

      if (index > -1) todos.value[index] = updated
    } catch (err: unknown) {
      // extractErrorMessage() is auto-imported from shared/utils/extractErrorMessage.ts
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function deleteTodo(id: number) {
    console.log('actions deleteTodo')

    loading.value = true
    error.value = null

    try {
      await $fetch<Todo>(`/api/todos?id=${id}`, { method: 'DELETE' })

      todos.value = todos.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      // extractErrorMessage() is auto-imported from shared/utils/extractErrorMessage.ts
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  }
})
