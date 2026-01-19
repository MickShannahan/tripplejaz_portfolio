
<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from './AppState';

const route = useRoute()
const  appState = computed(() => AppState)
const  hideNavbar = computed(() => route.meta?.hideNavbar)
const  hideFooter = computed(() => route.meta?.hideFooter)

onMounted(()=>{
  loadImageManifest()
})

async function loadImageManifest(){
  try {
      if (!AppState.galleryManifest) {
        const response = await fetch('/gallery/imageManifest.json')
        if (!response.ok) {
          console.warn('Manifest file not found. Run npm run process-images to generate it.')
          return
        }
        AppState.galleryManifest = await response.json()
        console.log('📦',AppState.galleryManifest)
      }
  } catch (error) {
    // Pop.error("failed to load image manifest")
    console.error("Failed to load image manifest")
    console.error(error)
  }
}


</script>

<template>
  <Navbar v-if="!hideNavbar" />

  <main class="my-5">
    <router-view v-if="AppState.galleryManifest" />
  </main>

  <Foot v-if="!hideFooter" />
</template>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
