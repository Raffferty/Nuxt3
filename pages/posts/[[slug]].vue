<template>
  <div class="posts-page">
    <h2>{{ slug ? 'Posts with Slug' : 'Posts without Slug' }}</h2>

    <p v-if="slug">[[slug]]: {{ slug }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const slug = route.params.slug
// Use useHead() → when you need full control (custom tags, scripts, favicons, preload, etc.).
// Use useSeoMeta() → when you only need SEO-related tags (title, description, Open Graph, Twitter cards).
useSeoMeta({
  title: slug ? `Posts - ${slug}` : 'Posts',
  description: `Details about posts ${slug}`,
  ogTitle: slug ? `Posts - ${slug}` : 'Posts',
})
</script>

<style lang="scss">
.posts-page {
  padding-top: 24px;
}
</style>
