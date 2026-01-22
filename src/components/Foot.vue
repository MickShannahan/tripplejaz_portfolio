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
  img{
    width: 100px;
    object-fit: contain;
    object-position: center;
    margin-bottom: -5px;
  }

  .bg-torn-paper{
    height: 100px;
    width: 100%;
    background-image: url(/src/assets/img/splatBorder.png?t=1769052825222), url(/src/assets/img/splatBorder.png?t=1769052825222), url(/src/assets/img/splatBorder.png?t=1769052825222);
    background-size: 1200px 100%;
    background-repeat: repeat;
    background-position: -150px;
    margin-bottom: -1px;
  }

</style>
