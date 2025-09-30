export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)

  // type Todo is auto-imported from shared/types/todos.ts
  return await $fetch<Todo>(`${event.context.mockApiTodos}/${id}`, {
    method: 'DELETE',
  })
})
