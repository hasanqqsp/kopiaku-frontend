import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Vue3Toastify from 'vue3-toastify'
import * as ConfirmDialog from 'vuejs-confirm-dialog'
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
})

app.use(ConfirmDialog)

app.mount('#app')
