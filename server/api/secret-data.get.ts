export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  console.log('defineEventHandler config.apiSecret', config.apiSecret)

  // Example API call that requires a secret
  const data = await $fetch('https://http.dog/200.json', {
    headers: {
      Authorization: `Bearer ${config.apiSecret}`,
    },
  }).then(
    (
      data, // add some delay
    ) =>
      new Promise((resolve) => {
        setTimeout(() => {
          return resolve(data)
        }, 2000)
      }),
  )

  return { data, apiSecret: config.apiSecret }
})
