<script setup>
import { useHead } from '@unhead/vue';
import { AppState } from '../AppState';
import GalleryBox from '../components/GalleryBox.vue';
import { GalleryImage } from '../models/GalleryImage';

useHead({
  title: AppState.baseSiteTitle + ' | Concept Art',
  meta: [{ property: '', content: '' }],
  htmlAttrs: {'data-bs-theme': 'dark'}
})

const galleryImgs = [
  new GalleryImage({
    path: 'concept_art/BaronDauntek_4K.webp'
  }),
  new GalleryImage({
    path: 'concept_art/ColorAndLight-Homework-3-NFowkes-MagicPunk-SelectD-Color.webp'
  }),
  new GalleryImage({
    path: 'concept_art/creaturesandcharacters-p1-portfolio06.webp'
  }),
  new GalleryImage({
    path: 'concept_art/CreaturesandCharacters-SkinandBones-2-Final.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Dreglands_Concept.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Green.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Purple.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Red.webp'
  }),
  new GalleryImage({
    path: 'concept_art/LaeOdeHome.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Laeodians.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Lol-Champ-Sheet-Page1.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Lol-Champ-Sheet-Page2.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Machi-CharacterConcept_4K.webp'
  }),
  new GalleryImage({
    path: 'concept_art/MagicPunk-BikeMakerMagicPunk-SelectD-CharacterDesign-Color.webp'
  }),
  new GalleryImage({
    path: 'concept_art/MagicPunk_Creature.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Bow_Portfolio.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Spear_Portfolio.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Sword_Portfolio.webp'
  }),
  new GalleryImage({
    path: 'concept_art/MP-MachisBike-4K.webp'
  }),
  new GalleryImage({
    path: 'concept_art/MP_Props.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final01.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final02-Gun.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final03-Vehicle.webp'
  }),
  new GalleryImage({
    path: 'concept_art/TheJex.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_Exploration-ColorVariants3.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_Exploration-Selects.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_Exploration-Thumbs.webp'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_Render-Team.webp'
  })
]

</script>


<template>
<GalleryBox :galleryImgs galleryType="grid"/>
</template>


<style lang="scss" scoped>

</style>