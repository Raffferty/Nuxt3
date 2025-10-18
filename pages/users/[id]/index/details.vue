<template>
  <div>
    <h2>{{ user?.name }}</h2>
  </div>
</template>

<script setup lang="ts">
// type User is auto-imported from shared/types/user.ts
const { user = null } = defineProps<{ user?: User }>()
</script>

<style></style>
