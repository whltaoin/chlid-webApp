import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入Vant框架
import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
// 使用Vant框架
app.use(Vant)
app.mount('#app')
