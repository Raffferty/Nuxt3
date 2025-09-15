<template>
  <div class="albums-page">
    <h2>Albums</h2>

    <AppButtonText :disabled="albumsStore.loading" @click="albumsStore.reloadAlbums()">
      Reload
    </AppButtonText>

    <AppButtonText
      v-if="!albumsStore.error"
      style="margin-left: 24px"
      :disabled="albumsStore.loading"
      @click="albumsStore.getError()"
    >
      Get Error
    </AppButtonText>

    <AppButtonText
      v-if="albumsStore.albums.length"
      style="margin-left: 24px"
      :disabled="albumsStore.loading"
      @click="albumsStore.clearAlbums()"
    >
      Clear Albums
    </AppButtonText>

    <p v-if="albumsStore.loading">Loading...</p>
    <p v-else-if="albumsStore.error">Error: {{ albumsStore.error.message }}</p>

    <ul v-else>
      <li v-for="album in albumsStore.albums" :key="album.id">title: {{ album.title }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAlbumsStore } from '@/stores/albums'
import AppButtonText from '~/components/AppButtonText.vue'

const albumsStore = useAlbumsStore()

albumsStore.ensureLoaded()
</script>

<style lang="scss">
.albums-page {
  padding-top: 24px;

  button {
    margin-bottom: 24px;
  }
}
</style>
