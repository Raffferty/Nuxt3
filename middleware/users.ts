export default defineNuxtRouteMiddleware(async () => {
  const user = useCookie<{ name: string } | null>('user')

  console.log('defineNuxtRouteMiddleware user', user.value)

  if (!user.value) {
    if (import.meta.client) {
      const isConfirmed = confirm(
        `Login please in your Profile.
(the Nuxt site popup will open)`,
      )

      if (isConfirmed) {
        await navigateTo('https://nuxt.com', {
          external: true,
          open: {
            target: '_blank',
            windowFeatures: {
              popup: true,
              top: 400,
              left: 35,
              width: 800,
              height: 500,
            },
          },
        })

        return navigateTo({ name: 'profile' })
      }
    }

    return abortNavigation()
  }

  return true
})
