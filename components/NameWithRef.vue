<script setup lang="ts">
const { name, setName } = useNameRef()
</script>

<template>
  <div style="border: 1px solid blue; padding: 10px; margin: 10px">
    <h3>ref Example</h3>
    <p>not shared Value: {{ name }}</p>
    <input v-model="name" placeholder="Change name" style="padding: 4px 8px" />
    <button
      style="padding: 2px 8px; margin-left: 16px; background-color: darkgrey"
      @click="setName('John Ref')"
    >
      Set to John Ref
    </button>
  </div>
</template>
