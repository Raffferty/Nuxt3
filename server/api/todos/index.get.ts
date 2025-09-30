export default defineEventHandler(async (event) => {
  // type Todo is auto-imported from shared/types/todos.ts
  return await $fetch<Todo[]>(`${event.context.mockApiTodos}`, {
    headers: { 'content-type': 'application/json' },
  })
})
