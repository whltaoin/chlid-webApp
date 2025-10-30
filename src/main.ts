import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
// uni-app中不需要Vue Router，使用pages.json配置路由

// 导入需要的vant组件
import { Button, Icon, Dialog, Field, Uploader, Cell, CellGroup } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
const pinia = createPinia()

// 配置Pinia
app.use(pinia)

// 注册需要的vant组件
app.use(Button)
app.use(Icon)
app.use(Dialog)
app.use(Field)
app.use(Uploader)

app.use(Cell)
app.use(CellGroup)

// uni-app中挂载方式
app.mount('#app')
