import { createApp } from 'vue'
import './style.css'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import store from './store'
import App from './App.vue'

createApp(App).use(router).use(store).use(ElementPlus).mount('#app')