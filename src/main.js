/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import api from './services/api'


loadFonts()


// Create vue app
const app = createApp(App)

// Inject API
app.provide('api', api)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)

// Mount vue app
app.mount('#app')
