export default defineNuxtRouteMiddleware(() => {
  const counterStore = useCounterStore()

  if (counterStore.count === 0) {
    if (import.meta.client) {
      alert('make counter > 0')
    }

    return abortNavigation()
  }

  return true
})
