<template>
  <div class="home-page">
    <AppButtonText class="home-page__counter-button" @click="handleClick">Counter++</AppButtonText>

    <h3 class="home-page__counter">count is: {{ counterStore.count }}</h3>
    <h3 class="home-page__double-counter">doubleCount is: {{ counterStore.doubleCount }}</h3>

    <AppButtonText class="home-page__counter-button" @click="counterStore.count = 0"
      >Reset Counter</AppButtonText
    >
  </div>
</template>

<script setup lang="ts">
// import AppButtonText from '@/components/app-button-text.vue' // explicitly import the component from @/components
// import { computed } from 'vue' // explicitly import Vue API from vue
// import { computed } from '#imports' // explicitly import Vue API from Nuxt's #imports - better way
// import { useCounterStore } from '@/stores/counter' // explicitly import the store

/* 
  in nuxt.config.ts we can disable auto-importing:

  // disable auto-importing composables and utilities
  // This will disable auto-imports completely but it's still possible to use explicit imports from #imports.
  imports: {
    autoImport: false,
  },

  // disable auto-importing components from your own ~/components directory
  components: {
    dirs: [],
  },

  But it is OK if we explicitly import even if auto-importing is diabled
 */

const counterStore = useCounterStore()

const color = computed(() => {
  return counterStore.count % 2 == 0
    ? { counter: 'aqua', double_counter: 'red' }
    : { counter: 'red', double_counter: 'aqua' }
})

const counter_color = computed(() => color.value.counter)
const double_counter_color = computed(() => color.value.double_counter)

const handleClick = () => {
  // counterStore.increment('a') // for type checking

  counterStore.increment(3)
}
</script>

<style lang="scss">
.home-page {
  width: fit-content;
  min-width: 350px;
  color: $color-black-2;
  text-align: center;

  &__counter-button {
    min-width: 180px;
    margin: 32px 0;
  }

  &__counter {
    min-height: 60px;
    margin-bottom: 2px;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    background-color: v-bind(counter_color);
  }

  &__double-counter {
    min-height: 60px;
    margin: 0;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    background-color: v-bind(double_counter_color);
  }
}
</style>
