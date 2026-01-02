<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';
import ButtonLink from '../components/ButtonLink.vue';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

useHead({
  title: AppState.baseSiteTitle + ' | Magic Punk',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'light'}
})


const galleryImgs = [
  new GalleryImage({path: 'magic_punk/BaronDauntek_4K.png'}),
  new GalleryImage({path: 'magic_punk/ColorAndLight-Homework-3-NFowkes-MagicPunk-SelectD-Color.jpg'}),
  new GalleryImage({path: 'magic_punk/creaturesandcharacters-p1-portfolio06.jpg'}),
  new GalleryImage({path: 'magic_punk/CreaturesandCharacters-SkinandBones-2-Final.jpg'}),
  new GalleryImage({path: 'magic_punk/daunteks01.jpg'}),
  new GalleryImage({path: 'magic_punk/Dreglands_Concept.jpg'}),
  new GalleryImage({path: 'magic_punk/KeyArt-Mining.png'}),
  new GalleryImage({path: 'magic_punk/LaeOdeHome.png'}),
  new GalleryImage({path: 'magic_punk/Laeodians.png'}),
  new GalleryImage({path: 'magic_punk/Machi-CharacterConcept_4K.png'}),
  new GalleryImage({path: 'magic_punk/MagicPunk-BikeMakerMagicPunk-SelectD-CharacterDesign-Color.jpg'}),
  new GalleryImage({path: 'magic_punk/MagicPunk_Creature.png'}),
  new GalleryImage({path: 'magic_punk/MagicPunk_Vol1_007.png'}),
  new GalleryImage({path: 'magic_punk/MagicPunk_Vol1_Chapter3_Break_COlor.jpg'}),
  new GalleryImage({path: 'magic_punk/MP-MachisBike.png'}),
  new GalleryImage({path: 'magic_punk/MP_Props.png'}),
  new GalleryImage({path: 'magic_punk/Skarper-Character-Sheet-Final01.jpg'}),
  new GalleryImage({path: 'magic_punk/Skarper-Character-Sheet-Final02-Gun.jpg'}),
  new GalleryImage({path: 'magic_punk/Skarper-Character-Sheet-Final03-Vehicle.jpg'}),
  new GalleryImage({path: 'magic_punk/TavernTrouble.jpg'}),
  new GalleryImage({path: 'magic_punk/Teep-MagicPunk+Character+Sheet-Update.jpg'}),
  new GalleryImage({path: 'magic_punk/TheJex.png'}),
  new GalleryImage({path: 'magic_punk/Wasteland01.jpg'}),
]

</script>


<template>
  <section class="container text-center py-5" style="max-width: calc(74ch + 8vw);">
    <h1 class="page-header">
      <strong>Welcome to the World of Geal'Don</strong>
    </h1>
    <div>
      <p class="large-font my-3">
        MagicPunk is a high fantasy sci-fi romp about a young elf named Machi who forsakes becoming an Enphyzar (mage) in search of the Ambassador, a fabled mage who mastered crystallic magic, called Enphyralism, without going completely insane. Magicpunk is a derogatory term for delinquents who use their enphyral powers to follow their own pursuits, marked particularly by travelling on speeder bikes called finzters, and forsaking the Enphyral Imperium's strict code of conduct: forbidden use of magic outside academy grounds.
      </p>
      <ButtonLink link="https://globalcomix.com/c/magicpunk/chapters/en/1/#c-comics-releases-70253">
        READ THE COMIC (DIGITAL)
      </ButtonLink>
      <p class="my-3">
        Familiarize yourself with the world of Gael’Don with on-going art explorations of various locales, characters and creatures.
      </p>
      <h2 class="font-large">
        Art Of Magic Punk
      </h2>
    </div>
  </section>
  <GalleryBox :galleryImgs galleryType="grid" rows="3" aspect-ratio="3/2"/>
</template>


<style lang="scss" scoped>

</style>