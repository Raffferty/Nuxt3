import { sleep } from '@/utils/sleep'
import type { User } from '@/types/user'

export default defineEventHandler(async () => {
  await sleep(1000)

  return await $fetch<User[]>('https://jsonplaceholder.typicode.com/users')
})
