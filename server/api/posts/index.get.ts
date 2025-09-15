import { sleep } from '@/utils/sleep'

export default defineEventHandler(async () => {
  await sleep(2000)

  return await $fetch('https://jsonplaceholder.typicode.com/posts')
})
