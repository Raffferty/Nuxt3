<script setup lang="ts">
const { name, setName } = useNameState()
</script>

<template>
  <div style="border: 1px solid green; padding: 10px; margin: 10px">
    <h3>useState Example</h3>
    <p>Shared value: {{ name }}</p>
    <input v-model="name" placeholder="Change name" style="padding: 4px 8px" />
    <button
      style="padding: 2px 8px; margin-left: 16px; background-color: darkgrey"
      @click="setName('John State')"
    >
      Set to John State
    </button>
  </div>
</template>
