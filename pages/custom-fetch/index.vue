<template>
  <div class="custom-fetch">
    <h2>Custom fetch</h2>
    <p>https://api.nuxt.com/contributors</p>

    <h3 v-if="error">Error: {{ error.message }}</h3>
    <h3>{{ pending ? 'Loading contributors...' : 'Contributors:' }}</h3>

    <div class="custom-fetch__data">
      <pre v-for="contributor in contributors" :key="contributor.githubId">{{ contributor }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { customFetchType } from '@/composables/useCustomFetch'

definePageMeta({
  layout: 'users',
})

interface Contributor {
  username: string
  githubId: string
  issues: number
  merged_pull_requests: number
  helpful_issues: number
  comments: number
  helpful_comments: number
  reactions: number
  score: number
}

// blocking the page
// const { data: contributors, pending } = await useCustomFetch<useCustomFetchType<Contributor[]>>('/contributors')

// non blocking
const { data, pending, error } = await useCustomFetch<customFetchType<Contributor[]>>(
  '/contributors',
  {
    key: 'contributors',
    lazy: true,
    // server: false,

    // getCachedData lets return cached data if it's still valid, or null/undefined to re-fetch.
    getCachedData(key, nuxtApp) {
      // return getCachedDataHelper(key, nuxtApp) // if ttl is not provided then default ttl = 1 hour = 1 * 60 * 60 * 1000 ms
      return getCachedDataHelper(key, nuxtApp, { ttl: 15 * 1000 }) // ttl 15 sec
    },

    transform(data) {
      return { ...data, res: data.res.slice(0, 3) }
    },
  },
)

const contributors = computed(() => {
  return data.value?.res || []
})
</script>

<style lang="scss">
.custom-fetch {
  &__data {
    margin-top: 16px;
    padding: 16px;
    border: 1px solid #ff00ea;
    overflow: auto;

    pre {
      padding: 24px 0;
      border-bottom: 2px solid #ff00ea;

      &:last-of-type {
        border: none;
      }
    }
  }
}
</style>
