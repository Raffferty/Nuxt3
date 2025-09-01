<template>
  <div class="posts-page">
    <h2>{{ slug ? 'Posts with Slug' : 'Posts without Slug' }}</h2>

    <p v-if="slug">[[slug]]: {{ slug }}</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const slug = route.params.slug
</script>

<style lang="scss">
.posts-page {
  padding-top: 24px;
}
</style>
