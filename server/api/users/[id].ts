export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') // from /api/user/:id

  console.log('id', id)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user ID',
    })
  }

  // type User is auto-imported from shared/types/user.ts
  return await $fetch<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
})
