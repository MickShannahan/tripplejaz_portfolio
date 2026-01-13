
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
      if (!AppState.manifestCache) {
        const response = await fetch('/gallery/imageManifest.json')
        if (!response.ok) {
          console.warn('Manifest file not found. Run npm run process-images to generate it.')
          return
        }
        AppState.manifestCache = await response.json()
        console.log(AppState.manifestCache)
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
    <router-view v-if="AppState.manifestCache" />
  </main>

  <Foot v-if="!hideFooter" />
</template>

<style lang="scss">
@import "./assets/scss/style.scss";
</style>
