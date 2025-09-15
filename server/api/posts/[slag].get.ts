import { sleep } from '@/utils/sleep'

export default defineEventHandler(async (event) => {
  const slag = getRouterParam(event, 'slag') // from /api/user/:slag

  if (!slag) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slag',
    })
  }

  await sleep(2000)

  return await $fetch(`https://jsonplaceholder.typicode.com/posts/${slag}`)
})
