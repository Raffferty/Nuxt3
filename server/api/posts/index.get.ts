import { sleep } from '@/utils/sleep'
import type { Post } from '@/types/post'

export default defineEventHandler(async () => {
  await sleep(2000)

  return await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
})
