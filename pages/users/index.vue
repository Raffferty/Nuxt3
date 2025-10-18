<template>
  <div class="user-index">
    <h2>Users Index</h2>
    <nav>
      <NuxtLink to="/users/company"><h3>User company</h3></NuxtLink>
      <NuxtLink to="/users/contacts"><h3>User contacts</h3></NuxtLink>
    </nav>

    <div class="users-child">
      <NuxtPage :user />
    </div>

    <AppUsers />
  </div>
</template>

<script setup lang="ts">
// to not write definePageMeta.layout = 'users' in every page under the /users we use users-layout.global.ts middleware
definePageMeta({
  // layout: 'users',
  title: 'Users page',
  redirect: '/users/company',
  middleware: 'users',
})

// const { data: users } = useNuxtData('users')
// console.log('Boolean(users.value)', Boolean(users.value))

// as we have 'await useFetch' here - the navigation to this page will wait until fetching is ended
// and in app.vue the NuxtLoadingIndicator will be shown
// if we set 'lazy: true'
// or if we use 'useLazyFetch'
// or if we don't use 'await'
// the navigation won't be blocked!

// type User is auto-imported from shared/types/user.ts
/* if (!users.value) {
  await useFetch<User[]>('/api/users', {
    key: 'users', // important: allows reuse via useNuxtData
    lazy: true,
    // server: false,
  })
} */

// type User is auto-imported from shared/types/user.ts
const { data: user, execute } = useFetch<User>('/api/users/1', {
  key: 'user-1',
  immediate: false,
  pick: ['name', 'address', 'company'], // to minimize the payload size
  transform: (user) => {
    // to alter the result of the query.
    return { ...user, name: `transformed name: ${user.name}!` }
  },
})

// fetch after 2s delay
setTimeout(() => {
  execute()
}, 2000)
</script>

<style lang="scss">
.user-index {
  nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .users-child {
    max-width: 100%;
    margin: 24px 0;
    padding: 16px;
    width: 500px;
    height: 400px;
    background-color: brown;
  }
}
</style>
