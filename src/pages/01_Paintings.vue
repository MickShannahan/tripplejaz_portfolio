<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 0,
  routePath: '/',
  hiddenPage: false,
  galleryFolder: 'paintings',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'Paintings',
  title: 'Paintings',
  theme: 'dark'
})
</script>

<script setup>
import { AppState } from '../AppState';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';
import { computed } from 'vue';

const galleryFolder = 'paintings'
const galleryGridClass = 'columns'
const galleryGridRowWidth = 300

const galleryImgs = computed(() => {
  if (!AppState.galleryManifest?.images) return []
  
  const folderPath = `${galleryFolder}/`
  return AppState.galleryManifest.images
    .filter(img => img.path.startsWith(folderPath))
    .map(img => new GalleryImage(img))
})

</script>

<template>
  <GalleryBox :galleryImgs="galleryImgs" :galleryType="galleryGridClass" :columnSize="galleryGridRowWidth" />
</template>

<style lang="scss" scoped>
</style>
