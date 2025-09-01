<template>
  <div class="user">
    <NuxtLink to="/users">{{ '<<' }} Go to Users</NuxtLink>
    <p v-if="!user">No user found</p>
    <pre v-else>{{ user }}</pre>
  </div>
</template>

<script setup lang="ts">
// we don't definePageMeta.layout = 'users' as we have wrapper <NuxtPage /> in pages/users.vue
definePageMeta({
  title: 'User page',
  validate: async (route) => {
    // Check if the id is made up of digits
    // If you return false, this will cause a 404 error.
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
  //   layout: 'users',
})

const route = useRoute()
console.log('route.params.id', route.params.id)

const { data: users } = useNuxtData('users')

if (!users.value) {
  console.log('id !users.value')

  const { data } = await useFetch('https://jsonplaceholder.typicode.com/users', { key: 'users' })

  users.value = data.value || []
}

console.log('users.value', users.value)

const user = users.value.find((user: { id: string }) => user.id == route.params.id)

console.log('user', user)
</script>

<style lang="scss">
.user {
  a {
    color: white;
    font-size: 24px;
  }
}
</style>
