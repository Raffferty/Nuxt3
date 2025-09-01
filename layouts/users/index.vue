<template>
  <div class="users-layout">
    <AppHeader />

    <h3>Users Layout</h3>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.users-layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: linear-gradient(to bottom, black 0%, blue 50%, black 100%);

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
