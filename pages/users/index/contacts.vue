<template>
  <div>
    <h3>User contacts</h3>
    <p>{{ user?.name }}</p>
    <pre>address: {{ user?.address }}</pre>
  </div>
</template>

<script setup lang="ts">
// to not write definePageMeta.layout = 'users' in every page under the /users we use users-layout.global.ts middleware
definePageMeta({
  //   layout: 'users',
  title: 'User contacts',
})

// type User is auto-imported from shared/types/user.ts
const { user = null } = defineProps<{ user?: User }>()
</script>
