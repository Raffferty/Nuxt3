export default defineNuxtPlugin((nuxtApp) => {
  // Log Vue render errors
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.log('Vue errorHandler:', error, instance, info)
  }

  // Log Nuxt errors (including 404)
  nuxtApp.hook('app:error', (err) => {
    console.log('plugins/error-handler: hook(app:error):', err)
  })
})
