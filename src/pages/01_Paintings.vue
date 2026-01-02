<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';
import FancyImage from '../components/FancyImage.vue';
import { GalleryImage } from '../models/GalleryImage';
import GalleryBox from '../components/GalleryBox.vue';

useHead({
  title: AppState.baseSiteTitle + ' | Paintings',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'dark'}
})

const galleryImgs = [
  new GalleryImage({
    path: 'paintings/Fairy+slug_UPDATE.webp'
  }),
  new GalleryImage({
    path: 'paintings/Fealty_Small.webp'
  }),
  new GalleryImage({
    path: 'paintings/Flying.webp'
  }),
  new GalleryImage({
    path: 'paintings/FlyingMen.webp'
  }),
  new GalleryImage({
    path: 'paintings/Globin_Small.webp'
  }),
  new GalleryImage({
    path: 'paintings/Machi-SplashKA_FINAL.webp'
  }),
  new GalleryImage({
    path: 'paintings/MadJak.webp'
  }),
  new GalleryImage({
    path: 'paintings/TavernTrouble_4K-2025.webp'
  })
]

</script>

<template>
<GalleryBox :galleryImgs galleryType="columns"/>


</template>



<style lang="scss" scoped>


</style>
