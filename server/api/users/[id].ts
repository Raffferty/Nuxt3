import type { User } from '@/types/user'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') // from /api/user/:id

  console.log('id', id)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing user ID',
    })
  }

  return await $fetch<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
})
