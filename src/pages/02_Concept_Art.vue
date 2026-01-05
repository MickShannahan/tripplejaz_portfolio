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
    path: 'concept_art/BaronDauntek_4K.png',
    description: "this is one bad dude, let me tell  you!"
  }),
  new GalleryImage({
    path: 'concept_art/creaturesandcharacters-p1-portfolio06.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/CreaturesandCharacters-SkinandBones-2-Final.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Dreglands_Concept.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Green.png'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Purple.png'
  }),
  new GalleryImage({
    path: 'concept_art/Imps_ConceptArt_Red.png'
  }),
  new GalleryImage({
    path: 'concept_art/joe-tripplejaz-zavaletta-lol-champ-sheet-page1.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/joe-tripplejaz-zavaletta-lol-champ-sheet-page2.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/LaeOdeHome.png'
  }),
  new GalleryImage({
    path: 'concept_art/Laeodians.png'
  }),
  new GalleryImage({
    path: 'concept_art/Machi-CharacterConcept_4K.png'
  }),
  new GalleryImage({
    path: 'concept_art/MagicPunk-BikeMaker-CharacterDesign-Color.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/MagicPunk-BikeMaker-Color.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/MagicPunk_Creature.png'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Bow_Portfolio.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Spear_Portfolio.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Mantid_Sword_Portfolio.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/MP-MachisBike-4K.png'
  }),
  new GalleryImage({
    path: 'concept_art/MP_Props.png'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final01.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final02-Gun.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Skarper-Character-Sheet-Final03-Vehicle.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/TheJex.png'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_01.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_02.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_03.jpg'
  }),
  new GalleryImage({
    path: 'concept_art/Wildcallers_Exploration-043.jpg'
  })
]

</script>


<template>
<GalleryBox :galleryImgs galleryType="grid"/>
</template>


<style lang="scss" scoped>

</style>