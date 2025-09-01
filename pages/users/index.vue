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
// we don't definePageMeta.layout = 'users' as we have wrapper <NuxtPage /> in pages/users.vue
definePageMeta({
  title: 'Users page',
  redirect: '/users/company',
  //   layout: 'users',
})

const { data: user } = await useFetch<{ name: string; address: { street: string } }>(
  'https://jsonplaceholder.typicode.com/users/1',
)
</script>

<style lang="scss">
.user-index {
  nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .users-child {
    margin: 24px 0;
    padding: 16px;
    width: 500px;
    height: 400px;
    background-color: brown;
  }
}
</style>
