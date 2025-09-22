<template>
  <div>
    <h3>User company</h3>
    <p>{{ user?.name }}</p>
    <pre>company: {{ user?.company }}</pre>
  </div>
</template>

<script setup lang="ts">
// to not write definePageMeta.layout = 'users' in every page under the /users we use users-layout.global.ts middleware
definePageMeta({
  //   layout: 'users',
  title: 'About User',
})

// type User is auto-imported from shared/types/user.ts
const { user = null } = defineProps<{ user?: User }>()
</script>
