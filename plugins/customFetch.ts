// $customFetch returns the data in the object { res: response._data, _fetchedAt: Date.now() }
export default defineNuxtPlugin((nuxtApp) => {
  const userAuth = useCookie('token')
  const config = useRuntimeConfig()

  const $customFetch = $fetch.create({
    baseURL: (config.public.baseUrlNuxtApi as string) ?? 'https://api.nuxt.com',
    onRequest({ request, options, error }) {
      console.log('$customFetch onRequest request', request)
      console.log('$customFetch onRequest error', error)

      if (userAuth.value) {
        // Add Authorization header
        options.headers.set('Authorization', `Bearer ${userAuth.value}`)
      }
    },
    onResponse({ response }) {
      console.log('$customFetch onResponse response', response)

      response._data = { res: response._data, _fetchedAt: Date.now() }
    },
    async onResponseError({ response }) {
      console.log('$customFetch onResponseError response', response)

      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })
  // Expose to useNuxtApp().$customFetch
  return {
    provide: {
      customFetch: $customFetch,
    },
  }
})
