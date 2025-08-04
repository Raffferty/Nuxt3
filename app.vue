<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome /> -->
    <h2 @click="counterStore.increment">Welcome</h2>
    <p>count is: {{ counterStore.count }}</p>
    <p>doubleCount is: {{ counterStore.doubleCount }}</p>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>
