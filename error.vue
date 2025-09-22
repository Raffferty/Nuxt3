<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout name="error">
    <div>
      <h2>statusCode: {{ error?.statusCode }}</h2>

      <p>message: {{ error?.statusMessage || error?.message }}</p>

      <AppButtonText @click="handleError">Clear errors</AppButtonText>
    </div>
  </NuxtLayout>
</template>
