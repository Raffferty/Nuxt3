<template>
  <div class="posts-page">
    <pre v-if="slug">
      routeRules: {
        '/api/posts/*': { cache: { maxAge: 10, swr: false } },
      }

      posts/[id] page is generated on demand, after fetch is done data is cached for 10 sec and is returned from the cache
      after 10 sec new fetch (see loading state) is done on demand and is set new cache time for next 10 sec
      maxAge > 0
    </pre>

    <pre v-else>
      routeRules: {
        '/api/posts': { cache: { maxAge: 15, swr: true } },
      }

      posts page is generated on demand, cached for 15 sec
      for newly came user after 15 sec the stale data is shown and cache is revalidated in background and only next user will see the new data
      never see loading state except on first fetch
    </pre>

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
const route = useRoute()

const slug = route.params.slug

// definePageMeta() is a compile-time macro.
// It runs before setup() executes, so you can’t access reactive values like useRoute() or route.params.slug inside it
// definePageMeta({
//  title: slug ? `Posts - ${slug}` : 'Posts', // this will not work
// })

// Use useHead() → when you need full control (custom tags, scripts, favicons, preload, etc.).
const config = useRuntimeConfig()

// Use useSeoMeta() → when you only need SEO-related tags (title, description, Open Graph, Twitter cards).
useSeoMeta({
  title: slug ? `${config.public.appName} - Post ${slug}` : `${config.public.appName} - Posts`,
  description: `Details about posts ${slug}`,
  ogTitle: slug ? `Posts - ${slug}` : 'Posts',
})

const testReFetch = ref(1)

// type Post is auto-imported from shared/types/post.ts
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

// to test reactive fetch when testReFetch.value is changed
/* if (slug) {
  setTimeout(() => {
    testReFetch.value = 2
  }, 5000)
} */
</script>

<style lang="scss">
.posts-page {
  padding-top: 24px;
}
</style>
