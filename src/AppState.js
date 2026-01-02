import { reactive } from 'vue'
import siteLogo from './assets/img/Tripplejaz_Splatter_Logo.webp'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  siteLogo,
  baseSiteTitle: 'Joe Zavaletta',
  currentYear: new Date().getFullYear(),
  landingPage: 'Paintings',
  socialLinks: [
    { text: 'Comic', link: 'https://globalcomix.com/c/magicpunk', icon: 'mdi-book-open' },
    { text: 'Instagram', link: 'https://www.instagram.com/tripplejaz/', icon: 'mdi-instagram' },
    { text: 'Portfolio', link: 'https://tripplejaz.art/', icon: 'mdi-palette' },
    { text: 'Brushes', link: 'https://tripplejaz.gumroad.com/', icon: 'mdi-brush' },
    { text: 'ArtStation', link: 'https://www.artstation.com/tripplejaz/albums/193591', icon: 'mdi-palette-advanced' },
    { text: 'ArtStation', link: 'https://www.artstation.com/tripplejaz/albums/193591', icon: 'mdi-palette-advanced' },
    { text: 'Art Prints', link: 'https://www.inprnt.com/gallery/tripplejaz/', icon: 'mdi-image-multiple' },
    { text: 'Youtube', link: 'https://www.youtube.com/@tripplejaz', icon: 'mdi-youtube' },
    { text: 'SkillShare', link: 'https://www.skillshare.com/en/referrals/general?teacherRef=473296912&via=teacher-referral-channel&utm_campaign=teacher-referral-channel&utm_source=ShortUrl&utm_medium=teacher-referral-channel&vanityUsername=tripplejaz', icon: 'mdi-school' },
  ]
})
