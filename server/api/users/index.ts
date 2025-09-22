export default defineEventHandler(async () => {
  // auto-imported from shared/utils/sleep.ts
  await sleep(1000)

  // type User is auto-imported from shared/types/user.ts
  return await $fetch<User[]>('https://jsonplaceholder.typicode.com/users')
})
