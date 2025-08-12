<template>
  <div class="app-spinner">
    <div class="loader" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.7);
}
/* HTML: <div class="loader"></div> */
.loader {
  width: 100px;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid transparent;
  border-radius: 50%;
  border-right-color: $color-purple-3;
  animation: l15 1s infinite linear;
}
.loader::before,
.loader::after {
  content: '';
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}
.loader::after {
  margin: 8px;
  animation-duration: 3s;
}
@keyframes l15 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
