import type { UseFetchOptions } from 'nuxt/app'

// using example: useCustomFetch<customFetchType<Contributor[]>>
export interface customFetchType<CFT> {
  res: CFT
  _fetchedAt: number
}

// <T> = <useCustomFetchType<CFT>>
// useCustomFetch returns the data in the object { res: response._data, _fetchedAt: Date.now() }
export function useCustomFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$customFetch, // returns the data in the object { res: response._data, _fetchedAt: Date.now() }
  })
}
