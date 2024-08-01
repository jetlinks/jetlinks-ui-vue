import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
import 'ant-design-vue/dist/antd.variable.min.css'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import i18n from './i18n'
import 'xgplayer/dist/index.min.css'
import '@/style/global.less'

dayjs.locale('zh-cn');

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
    .use(i18n)
  .mount('#app')
