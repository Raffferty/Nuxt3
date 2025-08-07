<template>
  <div>
    <AppButtonText @click="counterStore.increment">Click me</AppButtonText>

    <p>count is: {{ counterStore.count }}</p>
    <p>doubleCount is: {{ counterStore.doubleCount }}</p>
  </div>
</template>

<script setup lang="ts">
import AppButtonText from '@/components/app-button-text.vue'
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>
