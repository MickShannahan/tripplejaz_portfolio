<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 5,
  routePath: '/about',
  hiddenPage: false,
  galleryFolder: '',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'About',
  title: 'About',
  theme: 'light'
})
</script>

<script setup>
import { AppState } from '../AppState';
import ButtonLink from '../components/ButtonLink.vue';

</script>


<template>
  <section class="container">
    <div class="d-flex justify-content-center">
      <img src="../assets/img/JoeZavaletta_Profile.webp" alt="Image of Joe Zavaletta" class="profile-img">
    </div>
    <div class="d-flex justify-content-center my-4">
      <blockquote><em>
        <i class="mdi mdi-format-quote-open"></i>
        Fantasy belongs to the believer, not because his God is myth, but because his God first imagined.
        <i class="mdi mdi-format-quote-close"></i>
      </em></blockquote>
    </div>
    <div>
      <p>Drawing since the age of 2 (I remember), I found an affinity for telling stories on paper long before I made it to a computer screen. Video games, cinema, books and comics all contribute to my desire to tell old stories in new and exciting ways. I like to think of myself as a musician of sorts; the pencil is my chosen instrument, to the tune of child like wonder and imagination.</p>
      <div class="d-flex justify-content-center">
        <ButtonLink link="https://drive.google.com/file/d/1Kit57YhMr1oi1T0NaoRsQ_LU9Q-QK1lc/view">
          Resume PDF <i class="mdi mdi-file-document"></i>
        </ButtonLink>
      </div>
      
      <div class="my-3">
        <h4>Some of my Clients include</h4>
        <section class="d-flex flex-wrap gap-2 mb-2">
          <kbd>Riot Games</kbd>
          <kbd>Netflix</kbd>
          <kbd>Xbox</kbd>
          <kbd>SEGA</kbd>
          <kbd>EA</kbd>
          <kbd>Obsidian</kbd>
          <kbd>Konami</kbd>
        </section>
        <small>See my work on the <RouterLink to="/resume">resume</RouterLink> page</small>
      </div>
      <b>Check out my links below!</b>
    </div>
  </section>
</template>


<style lang="scss" scoped>
.profile-img{
  max-width: calc(12em + 5vw);
  border-radius: 40px;
  aspect-ratio: 1/1;
  object-fit: cover;
  object-position: center;
}

p{
  max-width: calc(60ch + 5vw);
}

kbd{
  font-size: 1.5em;
}

blockquote{
  max-width: calc(40ch + 5vw);
  text-align: center;
}
</style>