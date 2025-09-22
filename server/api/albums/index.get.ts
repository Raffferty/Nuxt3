export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const url =
    !query.get_error || query.get_error === 'false'
      ? 'https://jsonplaceholder.typicode.com/albums'
      : 'https://jsonplaceholder.typicode.com/albums-not-found'

  // auto-imported from shared/utils/sleep.ts
  await sleep(2000)

  // type Album is auto-imported from shared/types/album.ts
  return await $fetch<Album[]>(url)
})
