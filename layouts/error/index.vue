<template>
  <div class="error-layout">
    <h3>Error Layout</h3>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.error-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: linear-gradient(to bottom, black 0%, #8800ff 50%, black 100%);

  h3 {
    margin: 0;
    margin: 24px 0;
  }

  main {
    flex: 1 1 auto;
    min-height: 100%;
  }
}
</style>
