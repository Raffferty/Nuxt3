<template>
  <div class="default-layout">
    <h3>Default Layout</h3>

    <slot />
  </div>
</template>

<style lang="scss">
.default-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 33px;
  @include respond('lg') {
    padding: 0 10px;
  }
  @include respond('md') {
    padding: 0 6px;
  }
  main {
    flex: 1 1 auto;
    min-height: 100%;
  }
}
</style>
