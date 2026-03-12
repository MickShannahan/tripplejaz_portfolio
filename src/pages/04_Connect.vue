<script>
import { Page } from '../models/Page'

export const pageConfig = new Page({
  navOrder: 4,
  routePath: '/connect',
  hiddenPage: false,
  galleryFolder: '',
  galleryGridClass: 'columns',
  galleryGridRowWidth: 300,
  name: 'Connect',
  title: 'Connect',
  theme: 'dark'
})
</script>

<script setup>
import { computed } from 'vue';
import { AppState } from '../AppState';
import ButtonLink from '../components/ButtonLink.vue';

const skippedLinks = ['Patreon', 'Brushes']
const links = computed(()=> AppState.socialLinks?.filter(l => !skippedLinks.includes(l.text)))

</script>


<template>
<section class="container">
  <h1>My Links</h1>
  <article class="row row-cols-md-3 g-2 justify-content-center">
    <ButtonLink v-for="link in links" :link="link.link">
      <i :class="`mdi ${link.icon}`"></i> {{ link.text }}
    </ButtonLink>
  </article>


  <article>
    <h1>Courses</h1>
    <div class="d-flex">
      <a href="https://tripplejaz.gumroad.com/l/airbrushcourse" class="btn btn-link">
        <img src="../assets/img/gumroad_brushes.webp" alt="link to gumroad" class="img-fluid">
      </a>
      <a href="https://tripplejaz.gumroad.com/l/characterdesign" class="btn btn-link">
        <img src="../assets/img/gumroad_design_character.webp" alt="link to gumroad" class="img-fluid">
      </a>
    </div>
  </article>
  <article>
    <h1>Patreon</h1>
    <section class="row">
      <div class="col-md-4">
        <a href="https://www.patreon.com/cw/tripplejaz/membership">
          <img src="../assets/img/patreon_header.gif" alt="image of sly the lizard flipping knives" class="img-fluid rounded">
        </a>
      </div>
      <div class="col-md-8">
        <p>Get behind the scenes looks at what I'm cooking regarding upcoming projects, videos, and comic books.</p>
        <h4>What's included</h4>
        <ul>
          <li>High-res Final Art</li>
          <li>Never before seen concept art</li>
          <li>.PSD/.Clip files</li>
          <li>Sketches, Storyboards</li>
          <li>Time-lapses*</li>
          <small>*I don't always record everything, but when I do, you'll see it here</small>
        </ul>
        <ButtonLink link="https://www.patreon.com/cw/tripplejaz/membership">JOIN</ButtonLink>
      </div>
    </section>
  </article>
</section>
</template>


<style lang="scss" scoped>
.btn-link{
  width: calc(20em + 5vw);
  border-radius: 30px;
  overflow: hidden;
  padding: 0;
  transition: all .2s ease;
  height: 10%;
  img{
    object-fit: cover;
    transition: all .2s ease;
  }
  &:hover{
    filter: brightness(1.1);
    img{
      transform: scale(1.1);
    }
  }
}

.rounded{
  border-radius: 30px !important;
}

li{
  font-weight: bold;
}

small{
  font-size: 14px;
}
</style>