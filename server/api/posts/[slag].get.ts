export default defineEventHandler(async (event) => {
  const slag = getRouterParam(event, 'slag') // from /api/user/:slag

  if (!slag) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing slag',
    })
  }

  // auto-imported from shared/utils/sleep.ts
  await sleep(2000)

  // type Post is auto-imported from shared/types/post.ts
  return await $fetch<Post>(`https://jsonplaceholder.typicode.com/posts/${slag}`)
})
