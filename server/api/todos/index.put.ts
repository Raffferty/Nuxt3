export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)
  const body = await readBody<{ title: string }>(event)

  // type Todo is auto-imported from shared/types/todos.ts
  return await $fetch<Todo>(`${event.context.mockApiTodos}/${id}`, {
    method: 'PUT', // or PATCH
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: body.title }),
  })
})
