import { reactive } from 'vue'
import siteLogo from './assets/img/Tripplejaz_Splatter_Logo.webp'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  siteLogo,
  baseSiteTitle: 'Joe Zavaletta',
  currentYear: new Date().getFullYear(),
  landingPage: 'Paintings',
  socialLinks: [
    { text: 'Magic Punk Comic', link: 'https://globalcomix.com/c/magicpunk', icon: 'mdi-book-open' },
    { text: 'ArtStation', link: 'https://www.artstation.com/tripplejaz/albums/193591', icon: 'mdi-palette-advanced' },
    { text: 'Patreon', link: 'https://www.patreon.com/c/tripplejaz', icon: 'mdi-patreon' },
    { text: 'Youtube', link: 'https://www.youtube.com/@tripplejaz', icon: 'mdi-youtube' },
    { text: 'Instagram', link: 'https://www.instagram.com/tripplejaz/', icon: 'mdi-instagram' },
    { text: 'Art Prints', link: 'https://www.inprnt.com/gallery/tripplejaz/', icon: 'mdi-image-multiple' },
    { text: 'Brushes', link: 'https://tripplejaz.gumroad.com/', icon: 'mdi-brush' },
    { text: 'SkillShare', link: 'https://www.skillshare.com/en/referrals/general?teacherRef=473296912&via=teacher-referral-channel&utm_campaign=teacher-referral-channel&utm_source=ShortUrl&utm_medium=teacher-referral-channel&vanityUsername=tripplejaz', icon: 'mdi-school' },
    { text: 'Resume', link: 'https://drive.google.com/file/d/1Kit57YhMr1oi1T0NaoRsQ_LU9Q-QK1lc/view', icon: 'mdi-file-document-check' },
  ],
  siteRoutes: [],
  galleryManifest: null
})
