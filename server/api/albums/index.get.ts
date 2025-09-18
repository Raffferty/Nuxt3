import { sleep } from '@/utils/sleep'
import type { Album } from '@/types/album'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const url =
    !query.get_error || query.get_error === 'false'
      ? 'https://jsonplaceholder.typicode.com/albums'
      : 'https://jsonplaceholder.typicode.com/albums-not-found'

  await sleep(2000)

  return await $fetch<Album[]>(url)
})
