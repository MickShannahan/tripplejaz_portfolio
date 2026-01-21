<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 1,
  routePath: '/concept-art',
  hiddenPage: false,
  galleryFolder: 'concept art',
  galleryGridClass: 'grid',
  galleryGridRowWidth: 300,
  name: 'Concept Art',
  title: 'Concept Art',
  theme: 'dark'
})
</script>

<script setup>
import { AppState } from '../AppState';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';
import { computed } from 'vue';


const galleryImgs = computed(() => {
  if (!AppState.galleryManifest) return []
  
  const folderPath = `${pageConfig.galleryFolder}/`
  return AppState.galleryManifest
    .filter(img => img.path.startsWith(folderPath))
})

</script>

<template>
  <GalleryBox :galleryImgs="galleryImgs" :galleryType="pageConfig.galleryGridClass" :columnSize="pageConfig.galleryGridRowWidth" />
</template>


<style lang="scss" scoped>

</style>