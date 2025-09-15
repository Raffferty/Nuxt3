<template>
  <header>
    <NuxtLink class="logo-link" to="/">
      <AppLogo />
    </NuxtLink>
    <div class="links">
      <NuxtLink to="/">Home</NuxtLink>
      <!-- :class="{ 'router-link-active': $route.path.startsWith('/users') } for dinamic route /users/1 ... shown in [id].vue -->
      <NuxtLink to="/users/" :class="{ 'router-link-active': $route.path.startsWith('/users') }"
        >Users</NuxtLink
      >
      <NuxtLink to="/posts">Posts</NuxtLink>
      <NuxtLink to="/posts/2">Post + [[slug]]</NuxtLink>
      <NuxtLink to="/albums">Albums + Pinia</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
header {
  display: flex;
  align-items: stretch;
  gap: 24px;

  .logo-link {
    display: flex;
    align-items: center;
  }

  .links {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    border-bottom: 1px solid white;
  }

  a {
    font-size: 24px;
  }
}
</style>
