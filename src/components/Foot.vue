<script setup>
import { AppState } from '../AppState';
import SocialLinks from './SocialLinks.vue';


</script>

<template>
  <footer class="container-fluid bg-dark text-light p-4" data-bs-theme="dark">
    <div class="row align-items-end">
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

</style>
