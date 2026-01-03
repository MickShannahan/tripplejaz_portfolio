
<script setup>
import { computed } from 'vue';
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
import { AppState } from '../AppState';
import {routes} from '../router'
</script>

<template>
    <DesktopNav :logo="AppState.siteLogo" />

    <MobileNav :logo="AppState.siteLogo" />
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