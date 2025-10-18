<template>
  <div>
    <h3>
      <NuxtLink :to="`/users/${$route.params.id}`">{{ '<<' }} Back to User</NuxtLink>
    </h3>
    <h2>Edit the details of user {{ $route.params.id }} here.</h2>
    <h3>
      <NuxtLink to="/users">{{ '<<' }} Go to Users</NuxtLink>
    </h3>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss"></style>
