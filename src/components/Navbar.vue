
<script setup>
import { computed } from 'vue';
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
import { AppState } from '../AppState';
import { router } from '../router';

const routes = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta?.pageConfig && !route.meta.pageConfig.hiddenPage)
    .sort((a, b) => (a.meta?.pageConfig?.navOrder ?? 999) - (b.meta?.pageConfig?.navOrder ?? 999))
})

</script>

<template>
    <DesktopNav :logo="AppState.siteLogo" :routes />

    <MobileNav :logo="AppState.siteLogo" :routes />
</template>


<style lang="scss">
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