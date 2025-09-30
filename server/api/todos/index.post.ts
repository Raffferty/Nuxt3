export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string }>(event)
  const newTodo = { id: Date.now(), title: body.title }

  // type Todo is auto-imported from shared/types/todos.ts
  return await $fetch<Todo>(`${event.context.mockApiTodos}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(newTodo),
  })
})
