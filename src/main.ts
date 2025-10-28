import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
// 导入Vant框架
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()

// 使用插件
app.use(Vant)
app.use(pinia)
app.use(router)

app.mount('#app')
