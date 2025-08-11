import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref<number>(0)

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  function increment(i: number = 1) {
    count.value += i
  }

  return {
    // state
    count,
    // getters
    doubleCount,
    // actions
    increment,
  }
})
