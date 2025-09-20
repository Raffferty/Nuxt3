// Middleware handlers will run on every request before any other server route
// Middleware handlers should not return anything (nor close or respond to the request) and only inspect or extend the request context or throw an error.
export default defineEventHandler((event) => {
  if (event.path === '/api/secret-data') event.context.auth = { user: 123 }
})
