<template>
  <button class="app-button-text" type="button">
    <slot />
  </button>
</template>

<style lang="scss">
.app-button-text {
  position: relative;
  margin-bottom: 16px;
  padding: 10px 20px;
  border: 1px solid;
  border-radius: 4px;
  font-size: $font-size-md;
  font-weight: bold;
  color: $color;
  @include transition(background-color);

  @include respond(xl) {
    padding: 10px 5px;
  }

  @include hover-supported {
    background-color: $color-yellow-1;
  }
}
</style>
