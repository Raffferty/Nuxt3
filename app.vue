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

// watch and add route.meta.title from pages,
// for example from pages/posts/[[slug]].vue definePageMeta({ title: 'Posts' })
// to default head.title from nauxt.config head: { title: 'Nuxt3 Tutorial' }
// will become 'Nuxt3 Tutorial - Posts'
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
