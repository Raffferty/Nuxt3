export default defineEventHandler(async () => {
  // auto-imported from shared/utils/sleep.ts
  await sleep(2000)

  // type Post is auto-imported from shared/types/post.ts
  return await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
})
