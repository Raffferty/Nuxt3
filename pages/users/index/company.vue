<template>
  <div>
    <h3>User company</h3>
    <p>{{ user?.name }}</p>
    <pre>company: {{ user?.company }}</pre>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
// to not write definePageMeta.layout = 'users' in every page under the /users we use users-layout.global.ts middleware
definePageMeta({
  //   layout: 'users',
  title: 'About User',
})

const { user = null } = defineProps<{ user?: User }>()
</script>
