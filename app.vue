<template>
  <NuxtLoadingIndicator :height="5" color="#40ff00" error-color="#f00" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()

// Use useHead() → when you need full control (custom tags, scripts, favicons, preload, etc.).
// Use useSeoMeta() → when you only need SEO-related tags (title, description, Open Graph, Twitter cards).
useSeoMeta({
  // title: 'Nuxt3 Tutorial', // from nuxt.config.ts { app.head.title: process.env.NUXT_PUBLIC_APP_NAME } and in watch(() => route.meta.title, ()=>{...})
  description: 'A detailed description for better SEO.',
  ogTitle: 'Nuxt3 Tutorial',
  ogDescription: 'Open Graph description for social sharing: Nuxt3 Tutorial',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
})

// watch and add route.meta.title from pages,
// for example, from pages/profile/index.vue: definePageMeta({ title: 'Profile' })
// added to default head.title from nauxt.config head: { title: 'process.env.NUXT_PUBLIC_APP_NAME }
// will become 'Nuxt3 Tutorial - Profile'
watch(
  () => route.meta.title,
  (newTitle) => {
    useHead({
      titleTemplate: (titleChunk) => {
        return `${titleChunk}${newTitle ? ' - ' + newTitle : ''}`
      },
    })
  },
  { immediate: true },
)
</script>
