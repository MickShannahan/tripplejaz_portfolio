import '@mdi/font/css/materialdesignicons.css'
import { createHead } from '@unhead/vue/client'
import 'bootstrap'
import { createApp } from 'vue'
import App from './App.vue'
import { registerGlobalComponents } from './registerGlobalComponents'
import { router } from './router'


const root = createApp(App)
async function init() {
  const head = createHead()
  await registerGlobalComponents(root)
  root
    .use(head)
    .use(router)
    .mount('#app')
}
init()

