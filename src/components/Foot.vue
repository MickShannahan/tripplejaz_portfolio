<script setup>
import { AppState } from '../AppState';
import SocialLinks from './SocialLinks.vue';


</script>

<template>
  <footer class="container-fluid text-light" data-bs-theme="dark">
    <div class="row">
      <div class="col bg-torn-paper"></div>
    </div>
    <div class="row align-items-end bg-black px-4 pb-4 pt-2">
      <div class="col-md-5">
        <div>
          <img :src="AppState.siteLogo" alt="logo">
        </div>
        <div class="d-flex align-content-center text-shadow">
          <small>TrippleJaz</small>
          <i class="mdi mdi-circle-small"></i>
          <small>Joe Zavaletta</small> 
        </div>
        <div>
        </div>
      </div>
      <div class="col-md-7">
        <SocialLinks/>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.bg-black{
  background-color: #0f0f0f !important;
}

  img{
    width: 200px;
    aspect-ratio: 16/9;
    object-fit: cover;
    object-position: center;
    margin-bottom: -5px;
    filter: drop-shadow(0px -1px 0px var(--bs-jazzy));
  }

  .bg-torn-paper{
    height: 160px;
    width: 100%;
    background-image: url(/src/assets/img/DarkBanner-2026.png), url(/src/assets/img/DarkBanner-2026.png), url(/src/assets/img/DarkBanner-2026.png);
    background-size: 500px 160%;
    transform: scale(-1);
    background-repeat: repeat;
    background-position: -150px -20px;
    margin-bottom: -1px;
  }

</style>
