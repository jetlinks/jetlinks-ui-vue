import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
import 'ant-design-vue/dist/antd.variable.min.css'
import 'xgplayer/dist/index.min.css'
import '@/style/global.less'
import i18n from './i18n'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
    .use(i18n)
  .mount('#app')
