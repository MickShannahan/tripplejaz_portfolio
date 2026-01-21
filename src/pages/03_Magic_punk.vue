<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 2,
  routePath: '/magic-punk',
  hiddenPage: false,
  galleryFolder: 'magicpunk',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'Magic Punk',
  title: 'Magic Punk',
  theme: 'light'
})
</script>

<script setup>
import { AppState } from '../AppState';
import ButtonLink from '../components/ButtonLink.vue';
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
  <section class="container text-center py-5" style="max-width: calc(74ch + 8vw);">
    <h1 class="page-header">
      <strong>Welcome to the World of Geal'Don</strong>
    </h1>
    <div>
      <p class="large-font my-3 mb-4">
        MagicPunk is a high fantasy sci-fi romp about a young elf named Machi who forsakes becoming an Enphyzar (mage) in search of the Ambassador, a fabled mage who mastered crystallic magic, called Enphyralism, without going completely insane. Magicpunk is a derogatory term for delinquents who use their enphyral powers to follow their own pursuits, marked particularly by travelling on speeder bikes called finzters, and forsaking the Enphyral Imperium's strict code of conduct: forbidden use of magic outside academy grounds.
      </p>
      <h4>READ THE COMIC</h4>
      <div class="d-flex justify-content-center gap-2 mb-5">
        <ButtonLink link="https://globalcomix.com/c/magicpunk/chapters/en/1/#c-comics-releases-70253" class="btn-link">
          <img src="/src/assets/img/globalcomix_logo.png" alt="global comix logo" class="icon">
          Global Comix
        </ButtonLink>
        <ButtonLink link="https://www.webtoons.com/en/canvas/magicpunk/list?title_no=1116782" class="btn-link">
          <img src="/src/assets/img/webtoon_logo.png" alt="global comix logo" class="icon">
          Web Toons
        </ButtonLink>
        <ButtonLink link="https://tapas.io/series/MagicPunk/info" class="btn-link">
          <img src="/src/assets/img/tapas_logo.png" alt="global comix logo" class="icon bg-tapas" >
          Tapas
        </ButtonLink>
      </div>
      <p class="my-3">
        Familiarize yourself with the world of Gael’Don with on-going art explorations of various locales, characters and creatures.
      </p>
      <h2 class="font-large">
        Art Of Magic Punk
      </h2>
    </div>
  </section>
  <GalleryBox :galleryImgs="galleryImgs" :galleryType="pageConfig.galleryGridClass" :columnSize="pageConfig.galleryGridRowWidth" rows="3" aspect-ratio="3/2"/>
</template>


<style lang="scss" scoped>
.btn-link{
  min-width: 20ch;
}

.icon{
  height: 40px;
  width: 40px;
}

.bg-tapas{
  background-color: #fdca01;
  border-radius: 50px;
}
</style>