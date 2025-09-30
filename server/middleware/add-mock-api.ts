// Middleware handlers will run on every request before any other server route
// Middleware handlers should not return anything (nor close or respond to the request) and only inspect or extend the request context or throw an error.
export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig()

  if (event.path.startsWith('/api/todos'))
    event.context.mockApiTodos = `${runtimeConfig.mockApi}/${runtimeConfig.mockApiTodosPath}`
})
