
<script setup>
import { computed, ref } from 'vue';
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
import { AppState } from '../AppState';
import animatedLogo from '../assets/img/DarkLogoLoop-reduced.gif'
import { router } from '../router';

const logo = ref(AppState.siteLogo)

const routes = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta?.pageConfig && !route.meta.pageConfig.hiddenPage)
    .sort((a, b) => (a.meta?.pageConfig?.navOrder ?? 999) - (b.meta?.pageConfig?.navOrder ?? 999))
})

function changeLogoSource(){
  logo.value = animatedLogo
}

</script>

<template>
    <img class="pre-load position-absolute opacity-0 no-click" :src="animatedLogo" @load="changeLogoSource">
    <DesktopNav :logo="logo" :routes />

    <MobileNav :logo="logo" :routes />
</template>


<style lang="scss">
  .pre-load{
    height: 1px;
    width: 1px;
  }

  .nav-link{
    line-height: 24px;
    font-weight: 500;
    padding: .2em;
    transition: all .2s ease;
    margin: 0 .5em;
    &:hover{
      filter: brightness(1.4);
    }
  }

  .router-link-active{
    text-decoration: underline !important;
    text-underline-offset: 0.4em;
  }
</style>