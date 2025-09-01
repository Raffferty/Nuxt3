<template>
  <header>
    <NuxtLink class="logo-link" to="/">
      <AppLogo />
    </NuxtLink>
    <div class="links">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/users">Users</NuxtLink>
      <NuxtLink to="/posts">Posts</NuxtLink>
      <NuxtLink to="/posts/my-slug">Posts + [[slug]]</NuxtLink>
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
