<template>
  <button class="app-button-text" type="button">
    <slot />
  </button>
</template>

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
  @include transition(background-color);

  @include hover-supported {
    background-color: $color-blue-5;
  }
}
</style>
