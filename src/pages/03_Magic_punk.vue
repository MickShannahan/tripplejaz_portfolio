<script>
import { Page } from '../models/Page'
import skyImage from '../assets/img/Sky02-dither.png'
import skyImageSm from '../assets/img/Sky02-sm-dither.png'

const wideScreen = document.body.clientWidth > 768

export const pageConfig = new Page({
  navOrder: 2,
  routePath: '/magic-punk',
  hiddenPage: false,
  galleryFolder: 'magicpunk',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'Magic Punk',
  title: 'Magic Punk',
  theme: 'light',
  bgStyle: ` url(${wideScreen ? skyImageSm: skyImage}), linear-gradient(180deg, transparent -115px, var(--bs-body-bg) 80dvh)`
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
  <section class="container-fluid text-center py-5" style="max-width: calc(74ch + 8vw);">
    <!-- Splash Header -->
    <h1 class="page-header">
      <img class="img-fluid" src="../assets/img/MagicPunk-NoLightning.png" alt="Magic Punk Logo">
    </h1>
    <!-- About -->
      <section class="p-4 p-md-0">
        <div class="panel position-relative d-flex flex-column">
          <img class="machi-gif order-last" src="../assets/img/machi-power.gif" alt="image of the protagonist machi holding sparking magic power in his hands">
          <p class="p-3 p-md-5 machi-text-left position-relative">
            MagicPunk is an original, sci-fi, fantasy epic about  a young, elven mage absconds from his father's empire in search of a mythological, all-powerful wizard, angering the local dragon population. 
          </p>
        </div>

        <div class="comic-panels my-5 gap-3 p-2 p-md-0">

          <article class="img-panel" data-bs-tag="Mages Rid on Speeder Bikes">
            <img src="../assets/img/bike-slice.png" alt="">
            <p class="f-comic">Mages Ride on Speeder Bikes</p>
          </article>
          <article class="img-panel" data-bs-tag="Mages Rid on Speeder Bikes">
            <img src="../assets/img/mine-slice.png" alt="">
            <p class="f-comic">Magic Mined for Power</p>
          </article>
          <article class="img-panel" data-bs-tag="Mages Rid on Speeder Bikes">
            <img src="../assets/img/dragon-slice.png" alt="">
            <p class="f-comic">Dragons Rule the World</p>
          </article>

        </div>
      </section>
      
      <!-- Link Buttons -->
      <section>
        <h4 class="f-comic fs-3">READ THE COMIC!</h4>
        <div class="d-flex flex-wrap justify-content-center gap-2 mb-5">
          <ButtonLink link="https://globalcomix.com/c/magicpunk/chapters/en/1/#c-comics-releases-70253" class="btn-link">
            <img src="/src/assets/img/globalcomix_logo.png" alt="global comix logo" class="icon">
            Global Comix
          </ButtonLink>
          <ButtonLink link="https://www.webtoons.com/en/canvas/magicpunk/list?title_no=1116782" class="btn-link">
            <img src="/src/assets/img/webtoon_logo.png" alt="web toons logo" class="icon">
            Web Toons
          </ButtonLink>
          <ButtonLink link="https://tapas.io/series/MagicPunk/info" class="btn-link">
            <img src="/src/assets/img/tapas_logo.png" alt="Tapas Comics logo" class="icon bg-tapas" >
            Tapas
          </ButtonLink>
        </div>
        
        <h4 class="f-comic fs-3">SUPPORT THE COMIC!</h4>
        <div class="d-flex flex-wrap justify-content-center gap-2 mb-5">
          <ButtonLink link="https://tripplejaz.gumroad.com/l/magicpunk-1-6?layout=profile", class="btn-link">
            <img src="../assets/img/favicon.webp" class="icon rounded" alt="Close up of Machi's goggles">
            Download / Buy Comic
          </ButtonLink>
          <ButtonLink link="https://www.patreon.com/cw/tripplejaz/" class="btn-link">
            <img src="/src/assets/img/patreon_logo.png" alt="Patreon logo" class="icon bg-light rounded" >
            Patreon
          </ButtonLink>
        </div>


        <p class="my-3">
          Familiarize yourself with the world of Gael’Don with on-going art explorations of various locales, characters and creatures.
        </p>
      </section>
        <h2 class="font-large">
          Art Of Magic Punk
        </h2>
  </section>
  <GalleryBox :galleryImgs="galleryImgs" :galleryType="pageConfig.galleryGridClass" :columnSize="pageConfig.galleryGridRowWidth" rows="3" aspect-ratio="3/2"/>
</template>


<style lang="scss" scoped>

.page-header{
  filter: drop-shadow(2px 5px 0px rgba(35, 67, 175, 0.479));
}


.panel{
  // background-color: var(--bs-white);
  // border: 2px solid var(--bs-dark);
  perspective: 100px;
  padding-top: 1em;
  &::before{
    content: '';
    position: absolute;
    top: 24px;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, var(--bs-magic-light-blue), var(--bs-magic-orange) 70%);
    border: 2px solid var(--bs-dark);
    box-shadow: 5px 5px var(--bs-dark);
    transform: rotate3d(1,0,0, -2deg) ;
  }
  p{
    font-weight: 500;
    // text-shadow: 0px 0px 5px var(--bs-white);
  }
}

.machi-gif{
  // background-color: red;
  position: relative;
  max-width: 110%;
  filter: drop-shadow(5px 5px 0px black);
  margin-top: -35px;
}

.machi-text-left{
  width: 100%;
}

@media (min-width:768px) {
  .panel::before{
    top: 0;
    transform: skew(5deg);
  }

  .machi-gif{
    max-width: 100%;
    width: 580px;
    position: absolute;
    bottom: 0;
    right: -200px;
    padding-right: -100px;
  }
  .machi-text-left{
    width: 70%;
  }
}

.comic-panels{
  display: flex;
  flex-direction: column;
  perspective: 200px;
  .img-panel:nth-child(1){
    display: flex;
    transform: skew(5deg);
  }

  .img-panel:nth-child(2){
    align-self: end;
    display: flex;
    align-items: top;
    justify-content: end;
    transform: skew(-5deg);
  }

  .img-panel:last-child{
    display: flex;
    align-items: end;
    justify-content: end;
    transform: skew(5deg);
  }
}

.img-panel{
  width: 80%;
  border: 2px solid var(--bs-dark);
  box-shadow: 7px 7px 0px var(--bs-dark);
  position: relative;
  margin-bottom: 1em;
  img{
    width: 100%;
    aspect-ratio: 2/1;
    object-fit: cover;
  }
  p{
    font-size: calc(1em + .25vw);
    position: absolute;
    margin: -.75em;
    background-color: var(--bs-white);
    padding: .25em .5em;
    border: 2px solid var(--bs-dark);
  }
}

@media (min-width: 768px){
  .comic-panels{
  display: flex;
  flex-direction: row;
  perspective: 200px;
  font-size: 16px;
  .img-panel:nth-child(1){
    transform: skew(5deg);
    display: flex;
  }

  .img-panel:nth-child(2){
    transform: rotate3d(1,0,0, -7deg) scaleY(1.02);
    position: relative;
    top: 12px;
    display: flex;
    align-items: end;
    justify-content: center;
  }

  .img-panel:last-child{
    transform: skew(-5deg);
    display: flex;
    justify-content: end;
    align-items: start;
  }
}

.img-panel img{
  aspect-ratio: 1/1;
}
}





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