<template>
  <div class="default-layout">
    <div class="default-layout__logo-section">
      <NuxtLink to="/">
        <NuxtImg
          src="/images/logo.jpg"
          width="64"
          height="64"
          alt="Nuxt3 Tutorial"
          loading="lazy"
        />
      </NuxtLink>

      <h3>Default Layout</h3>
    </div>

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

  @include respond('lg') {
    padding: 0 10px;
  }

  @include respond('md') {
    padding: 0 6px;
  }

  &__logo-section {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    h3 {
      margin: 0;
      margin-left: 24px;
    }
  }

  main {
    flex: 1 1 auto;
    min-height: 100%;
  }
}
</style>
