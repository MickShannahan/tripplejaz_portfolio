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
    path: 'paintings/Fairy slug_UPDATE.jpg'
  }),
  new GalleryImage({
    path: 'paintings/Fealty.jpg'
  }),
  new GalleryImage({
    path: 'paintings/Flying.jpg'
  }),
  new GalleryImage({
    path: 'paintings/FlyingMen.jpg'
  }),
  new GalleryImage({
    path: 'paintings/Globin_Small.jpg'
  }),
  new GalleryImage({
    path: 'paintings/Machi-SplashKA_FINAL.jpg'
  }),
  new GalleryImage({
    path: 'paintings/MadJak.jpg'
  }),
  new GalleryImage({
    path: 'paintings/TavernTrouble_4K-2025.jpg'
  })
]

</script>

<template>
<GalleryBox :galleryImgs galleryType="columns"/>


</template>



<style lang="scss" scoped>


</style>
