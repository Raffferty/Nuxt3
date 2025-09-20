<template>
  <div class="posts-page">
    <h2>{{ slug ? 'Post with Slug' : 'Posts without Slug' }}</h2>

    <p v-if="slug">[[slug]]: {{ slug }}</p>

    <p v-if="pending">...Loading</p>
    <p v-else-if="error">{{ error.message }}</p>

    <Transition name="fade">
      <pre v-if="post" style="white-space: break-spaces">post: {{ post }}</pre>
    </Transition>

    <Transition name="fade">
      <ul v-if="postsToShow.length && !pending && !error">
        <li v-for="postItem in postsToShow" :key="postItem.id">
          <pre style="white-space: break-spaces">{{ postItem }}</pre>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/post'
const route = useRoute()

const slug = route.params.slug

// Use useHead() → when you need full control (custom tags, scripts, favicons, preload, etc.).
// Use useSeoMeta() → when you only need SEO-related tags (title, description, Open Graph, Twitter cards).
useSeoMeta({
  title: slug ? `Posts - ${slug}` : 'Posts',
  description: `Details about posts ${slug}`,
  ogTitle: slug ? `Posts - ${slug}` : 'Posts',
})

const testReFetch = ref(1)

const { data: posts } = useNuxtData<Post[]>('posts')
const { data: post } = useNuxtData<Post>(`posts-${slug}`) // this `posts-${slug}` is initated only on first time

const postsToShow = computed(() => (posts.value && !slug ? posts.value.slice(0, 5) : []))

// here slug is not reactive
// if it was reactive and we wanted to refetch when its value is changed, we should write getter function:
// useLazyFetch(() => slug.value ? `/api/posts/${slug.value}`)
// and there shouldn't be a key !

// useLazyFetch doesn't respect await and doesn't block the page on client-side navigation (CSR)
// useFetch respects await and blocks the page on client-side navigation (CSR) if is used with await
// both useLazyFetch and useFetch block the page on INITIAL (SSR) loading - no matter await is present or not
const { pending, error } = useLazyFetch(
  // () => (slug ? `/api/posts/${slug}?${testReFetch.value}` : '/api/posts'), // to refetch shouldn't be key
  slug ? () => `/api/posts/${slug}?${testReFetch.value}` : '/api/posts', // this doesn't refetch despite testReFetch.value
  {
    key: slug ? `posts-${slug}` : 'posts',
    // key: () => (slug ? `posts-${slug}-${testReFetch.value}` : 'posts'), // here testReFetch is reactive and will refetch when it changes
    // watch: false, // if we don't want to wathch and refetch
    watch: [testReFetch],
    // server: false, // if we don't want to block the page on INITIAL (SSR) loading, as both useLazyFetch and useFetch block the page on SSR
    // lazy: true // used with useFetch is the same as useLazyFetch
  },
)

if (slug) {
  setTimeout(() => {
    testReFetch.value = 2
  }, 5000)
}
</script>

<style lang="scss">
.posts-page {
  padding-top: 24px;
}
</style>
