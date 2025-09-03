<script setup>
// definePageMeta() is a compiler-hint helper that is only usable inside the script block of a single file component which is also a page.
definePageMeta({
  title: 'All users',
  layout: 'users',
  middleware: 'users',
})
</script>

<template>
  <!-- wrapper to use layout: 'users' for all routs under the users:
    /users
    /users/1 ... 

    so you don't have to definePageMeta.layout 'users' in evry file 
-->
  <NuxtPage />
</template>
