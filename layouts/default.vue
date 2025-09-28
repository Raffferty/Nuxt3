<template>
  <div class="default-layout">
    <AppHeader />

    <h3>Default Layout</h3>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.default-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: url('@/assets/images/bg-default.svg') no-repeat center;
  background-size: cover;

  @include respond(sm) {
    padding: 15px;
  }

  h3 {
    margin: 0;
    margin-top: 24px;
  }

  main {
    flex: 1 1 auto;
    min-height: 100%;
  }
}
</style>
