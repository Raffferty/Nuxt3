<script setup lang="ts">
import type { FetchError } from 'ofetch'

const pendingFetch = ref(false)
const errorFetch = ref<FetchError<unknown> | null | undefined>(null)

const { data: users } = useNuxtData('users')
console.log('AppUsers Boolean(users.value)', Boolean(users.value))

/**
 * This fetches the data on first load and provides a key ("users")
 */
// type User is auto-imported from shared/types/user.ts
if (!users.value) {
  const { data, pending, error } = await useFetch<User[]>('/api/users', {
    key: 'users', // important: allows reuse via useNuxtData
    // lazy: true,
  })

  users.value = data.value || []
  pendingFetch.value = pending.value
  errorFetch.value = error.value
}
</script>

<template>
  <div class="users">
    <h2>Users</h2>
    <div v-if="pendingFetch">Loading...</div>
    <div v-else-if="errorFetch">Error: {{ errorFetch.message }}</div>
    <ul v-else>
      <!-- <NuxtLink v-for="user in users" :key="user.id" :to="`/users/${user.id}`"> -->
      <NuxtLink
        v-for="user in users"
        :key="user.id"
        :to="{ name: 'users-id', params: { id: user.id } }"
      >
        <pre>{{ user }}</pre>
      </NuxtLink>
    </ul>
  </div>
</template>

<style lang="scss">
.users {
  pre {
    padding: 16px 0;
    border-top: 1px solid white;
  }
}
</style>
