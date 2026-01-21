
<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from './AppState';
import { GalleryImage } from './models/GalleryImage';
import { GalleryProject } from './models/GalleryProject';

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
        const data = await response.json()
        const images = []
        const projects = {}
        data.images.forEach(img => {
          if(img.path.includes('$project')){
            let projName = img.path.slice(0,img.path.lastIndexOf('/'))
            projects[projName] = !projects[projName] ? [img] : [...projects[projName], img]
          } else {
            images.push(new GalleryImage(img))
          }
        })
        for(let name in projects){
          const projImages = projects[name].map(img => new GalleryImage(img)).sort((a,b)=> -(b.name > a.name))
          images.push(new GalleryProject(projImages[0], projImages))
        }
        AppState.galleryManifest = images.sort((a,b)=>  -(b.path > a.path))
        // console.log('📦',AppState.galleryManifest)
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
