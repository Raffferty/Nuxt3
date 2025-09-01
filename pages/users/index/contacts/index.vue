<template>
  <div>
    <h3>User contacts</h3>
    <p>{{ user?.name }}</p>
    <pre>address: {{ user?.address }}</pre>
  </div>
</template>

<script setup lang="ts">
// we don't definePageMeta.layout = 'users' as we have wrapper <NuxtPage /> in pages/users.vue
definePageMeta({
  title: 'User contacts',
  //   layout: 'users',
})

interface Props {
  user: {
    name: string
    address: { street: string }
  }
}

const { user } = defineProps<Props>()
</script>
