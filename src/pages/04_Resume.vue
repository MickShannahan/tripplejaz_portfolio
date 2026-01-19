<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 3,
  routePath: '/resume',
  hiddenPage: false,
  galleryFolder: 'resume',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'Resume',
  title: 'Resume',
  theme: 'dark'
})
</script>

<script setup>
import { AppState } from '../AppState';
import ButtonLink from '../components/ButtonLink.vue';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';
import { computed } from 'vue';


const galleryImgs = computed(() => {
  if (!AppState.galleryManifest?.images) return []
  
  const folderPath = `${pageConfig.galleryFolder}/`
  return AppState.galleryManifest.images
    .filter(img => img.path.startsWith(folderPath))
    .map(img => new GalleryImage({ path: img.path }))
})

const riotImgs = [
  new GalleryImage({path: 'resume/riot_games/Riot_TFT_Island_Map_Final_83123_small.webp'}),
  new GalleryImage({path: 'resume/riot_games/slice1.webp'}),
  new GalleryImage({path: 'resume/riot_games/slice2.webp'}),
  new GalleryImage({path: 'resume/riot_games/slice3.webp'}),
  new GalleryImage({path: 'resume/riot_games/slice4.webp'})
]

console.log(riotImgs)

const segaImgs = [
  new GalleryImage({path: 'resume/sega_forever/Sonic1-final.webp'}),
  new GalleryImage({path: 'resume/sega_forever/Sonic2-SonicTeam-Unfiltered.webp'}),
  new GalleryImage({path: 'resume/sega_forever/Sonic3-Unfiltered.webp'}),
  new GalleryImage({path: 'resume/sega_forever/SuperMonkeyBallAventure_Small.webp'})
]

const relicsImgs = [
  new GalleryImage({path: 'resume/relics_of_moon/Imps_ConceptArt_Green.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Imps_ConceptArt_Purple.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Imps_ConceptArt_Red.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Imps_Enviro_Tatt.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Mantids_Enviro.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Mantid_Bow_Portfolio.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Mantid_Spear_Portfolio.webp'}),
  new GalleryImage({path: 'resume/relics_of_moon/Mantid_Sword_Portfolio.webp'})
]

const edgeComicImages = [
  new GalleryImage({path: 'resume/edge_comic/InsideCover.webp'}),
  new GalleryImage({path: 'resume/edge_comic/InsideCover_Right.webp'}),
  new GalleryImage({path: 'resume/edge_comic/Issue#3_P1.webp'}),
  new GalleryImage({path: 'resume/edge_comic/Issue#3_P5.webp'}),
  new GalleryImage({path: 'resume/edge_comic/Issue#3_P7.webp'}),
  new GalleryImage({path: 'resume/edge_comic/Issue4_P6 (1).webp'}),
  new GalleryImage({path: 'resume/edge_comic/Issue4_P6.webp'}),
  new GalleryImage({path: 'resume/edge_comic/TheEdge_Issue4_1.webp'}),
  new GalleryImage({path: 'resume/edge_comic/TheEdge_Issue4_3.webp'}),
  new GalleryImage({path: 'resume/edge_comic/TheEdge_Issue4_6.webp'}),
  new GalleryImage({path: 'resume/edge_comic/TheEdge_Issue4_9.webp'})
]


</script>


<template>
<section class="container d-flex justify-content-center mb-4">
<ButtonLink link="https://drive.google.com/file/d/1Kit57YhMr1oi1T0NaoRsQ_LU9Q-QK1lc/view">
  Resume PDF <i class="mdi mdi-file-document"></i>
</ButtonLink>
</section>

<section class="container my-4">
  <h1 class="text-center">Client Projects</h1>
  <hr class="mb-5">

  <article>
    <h2><kbd>Riot Games</kbd> Team Fight Tactics </h2>
    <small> (Set 10), Skylight Collective</small>
    <GalleryBox :gallery-imgs="riotImgs" gallery-type="carousel"/>
  </article>

  <article>
    <h2><kbd>SEGA - SEGA Forever</kbd> Sonic Origins</h2>
    <small>Social Media Promotional Art</small>
    <GalleryBox :gallery-imgs="segaImgs" gallery-type="carousel"/>
  </article>

  <article>
    <h2><kbd>Tim Yuen</kbd> Relics of the Moon</h2>
    <small>Various art for the roleplaying game</small>
    <GalleryBox :gallery-imgs="relicsImgs" gallery-type="carousel"/>
  </article>

  <article>
    <h2><kbd>Kershaw Knives</kbd>The Edge Comic</h2>
    <small>Illustrations for comic</small>
    <GalleryBox :gallery-imgs="edgeComicImages" gallery-type="carousel"/>
  </article>

</section>
</template>


<style lang="scss" scoped>
article{
  margin: 3rem 0rem;
}
</style>