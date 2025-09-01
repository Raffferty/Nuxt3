<template>
  <div>
    <h3>User company</h3>
    <p>{{ user?.name }}</p>
    <pre>company: {{ user?.company }}</pre>
  </div>
</template>

<script setup lang="ts">
// we don't definePageMeta.layout = 'users' as we have wrapper <NuxtPage /> in pages/users.vue
definePageMeta({
  title: 'About User',
  //   layout: 'users',
})

interface Props {
  user: {
    name: string
    company: { name: string }
  }
}

const { user } = defineProps<Props>()
</script>
