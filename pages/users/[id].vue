<template>
  <div class="user">
    <NuxtLink to="/users">{{ '<<' }} Go to Users</NuxtLink>
    <p v-if="!user">No user found</p>
    <pre v-else>{{ user }}</pre>
  </div>
</template>

<script setup lang="ts">
// to not write definePageMeta.layout = 'users' in every page under the /users we use users-layout.global.ts middleware
definePageMeta({
  // layout: 'users',
  title: 'User page',
  validate: async (route) => {
    // Check if the id is made up of digits
    // If you return false, this will cause a 404 error.
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },

  // this sets the transition named 'rotate' for current page (css is defined in app.vue)
  /* pageTransition: {
    name: 'rotate',
  }, */

  // using JS hooks in pageTransition:
  pageTransition: {
    name: 'rotate', // css is defined in app.vue
    mode: 'out-in',
    onBeforeEnter: (el) => {
      console.log('Before enter... el.tagName', el.tagName)
    },
    onEnter: (el, done) => {
      console.log('onEnter enter...el.tagName', el.tagName)
      console.log('onEnter enter...done', done())
    },
    onAfterEnter: (el) => {
      console.log('onAfterEnter enter... el.tagName', el.tagName)
    },
  },
})

const route = useRoute()
console.log('route.params.id', route.params.id)

const { data: users } = useNuxtData('users')

if (!users.value) {
  console.log('id !users.value')

  const { data } = await useFetch('https://jsonplaceholder.typicode.com/users', { key: 'users' })

  users.value = data.value || []
}

console.log('users.value', users.value)

const user = users.value.find((user: { id: string }) => user.id == route.params.id)

console.log('user', user)
</script>

<style lang="scss">
.user {
  a {
    color: white;
    font-size: 24px;
  }
}
</style>
