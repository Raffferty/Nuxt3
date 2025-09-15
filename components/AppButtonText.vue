<template>
  <button class="app-button-text" type="button" :disabled>
    <slot />
  </button>
</template>

<script setup lang="ts">
const { disabled = false } = defineProps<{ disabled?: boolean }>()
</script>

<style lang="scss">
.app-button-text {
  position: relative;
  padding: 10px 20px;
  border: 1px solid;
  border-radius: 4px;
  font-size: $font-size-md;
  font-weight: bold;
  background-color: $color-blue-1;
  color: $color;
  user-select: none;

  @include transition(background-color);

  @include hover-supported {
    background-color: $color-blue-5;
  }

  &[disabled] {
    background-color: gray;
    pointer-events: none;
  }
}
</style>
