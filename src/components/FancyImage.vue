<script setup>
import { ref } from 'vue';
import { GalleryImage } from '../models/GalleryImage';
import { getGalleryImagePath } from '../utils/pathUtils';

const {imgData, position} = defineProps({
  imgData : {type: GalleryImage, required: true},
  position: Number
})

const emit = defineEmits('imgClicked')

const loaded = ref(false)

function setActiveImage(){
  emit('imgClicked', imgData)
}

</script>


<template>
<div @click="setActiveImage" class="img-wrapper" :style="`--w: ${imgData.width}px; --h: ${imgData.height}px; --pos: ${position || 1}`">
  <img loading="lazy" @load="loaded = true" :src="getGalleryImagePath(imgData.path)" :alt="imgData.title"  :class="{loaded}">
  <!-- <div class="place-holder-box"></div> -->
</div>
<div class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      modal content
    </div>
  </div>
</div>
</template>


<style lang="scss" scoped>
.img-wrapper{
  position: relative;
  overflow: hidden;
  // height: var(--h);
  // width: var(--w);
  img{
    transform: translateY(100%);
    // position: absolute;
    object-fit: contain;
    width: 100%;
    transition: all .2s calc(.025s * var(--pos)) ease;
  }
  img.loaded{
    transform: translate(0%);
  }
  img:hover{
    transform: scale(1.05);
    cursor: zoom-in;
  }
  .place-holder-box{
    // position: absolute;
  }
}
</style>