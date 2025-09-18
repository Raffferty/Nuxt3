import { sleep } from '@/utils/sleep'
import type { Post } from '@/types/post'

export default defineEventHandler(async (event) => {
  const slag = getRouterParam(event, 'slag') // from /api/user/:slag

  if (!slag) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slag',
    })
  }

  await sleep(2000)

  return await $fetch<Post>(`https://jsonplaceholder.typicode.com/posts/${slag}`)
})
