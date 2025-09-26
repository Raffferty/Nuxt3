export default defineNuxtPlugin(() => {
  const route = useRoute()
  const config = useRuntimeConfig()

  watchEffect(() => {
    // split('?')[0] strips query parameters so canonical URLs don’t include tracking parameters like ?utm_source=…
    let path = route.fullPath.split('?')[0] || '/' // Always keep root as `/`

    // Remove trailing slash for non-root paths
    if (path !== '/' && path.endsWith('/')) {
      path = path.slice(0, -1)
    }

    const canonicalUrl = `${config.public.siteUrl}${path}`

    useHead({
      link: [{ rel: 'canonical', href: canonicalUrl }],
    })
  })
})
