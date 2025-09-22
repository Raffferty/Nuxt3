import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAlbumsStore = defineStore('albums', () => {
  const get_error = ref(false)
  const params = computed(() => (get_error.value ? { get_error: get_error.value } : {}))

  // type Album is auto-imported from shared/types/album.ts
  const {
    data: albumsData,
    pending: loading,
    error,
    execute: getAlbums,
    clear,
  } = useFetch<Album[] | null>('/api/albums', {
    key: 'albums',
    lazy: false,
    server: true,
    immediate: false,
    // watch: false,
    params: params, // to watch params and run useFetch we dont use params.value! using reactive params
  })

  const allAlbums = computed(() => albumsData.value?.slice(0, 10) ?? [])

  const lastFetched = ref<number | null>(null)
  const ttl = 10 * 1000 // time to live

  async function ensureLoaded() {
    get_error.value = false

    const expired = !lastFetched.value || Date.now() - lastFetched.value > ttl

    if (!albumsData.value || expired) {
      await getAlbums()

      lastFetched.value = Date.now()
    }
  }

  function reloadAlbums() {
    if (get_error.value) {
      get_error.value = false

      return
    }

    getAlbums()
  }

  function getError() {
    get_error.value = true
  }

  function clearAlbums() {
    clear()
  }

  return {
    albums: allAlbums,
    ensureLoaded,
    getAlbums,
    reloadAlbums,
    getError,
    clearAlbums,
    loading,
    error,
  }
})
