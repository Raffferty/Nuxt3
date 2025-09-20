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
      <NuxtLink to="/custom-fetch">Custom fetch</NuxtLink>
      <NuxtLink to="/profile">Profile / {{ user ? 'Logout' : 'Login' }}</NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useCookie<{ name: string } | null>('user')
</script>

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
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid white;

    @include respond(xl) {
      justify-content: start;
    }

    a {
      padding: 0 8px;
      border: 1px solid white;
      transition: background-color 0.5s;

      &.router-link-active {
        border-color: #40ff00;
      }

      @include hover-supported() {
        &:hover:not(.router-link-active) {
          background-color: #2aa102;
        }
      }
    }
  }

  a {
    font-size: 24px;
  }
}
</style>
