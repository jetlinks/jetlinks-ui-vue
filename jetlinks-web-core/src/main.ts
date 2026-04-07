import { createApp } from 'vue'
import App from './App.vue'
import router from '@jetlinks-web-core/router'
import pinia from '@jetlinks-web-core/store'
import i18n from '@jetlinks-web-core/locales'
import JetLinksComponents from '@jetlinks-web/components'
import components from './components'
import directive from '@jetlinks-web-core/directive'
import dayjs from 'dayjs'
import { loadMicroApp, initAxios } from '@jetlinks-web-core/package'
import andtv from 'ant-design-vue'
import '@jetlinks-web-core/style.css'

import 'vue3-json-viewer/dist/index.css'
import 'xgplayer/dist/index.min.css'
import '@jetlinks-web-core/style/global.less'
import 'dayjs/locale/zh-cn'
import microApp from '@micro-zoe/micro-app'

dayjs.locale('zh-cn')

initAxios()
loadMicroApp()

if (import.meta.env.VITE_MICRO_APP) {
  microApp.start({
    iframe: true,
    'keep-router-state': true,
    'router-mode': 'pure'
  })
}

const app = createApp(App)

app.provide('appInstance', app)
  .use(pinia)
  .use(router)       // ✅ 异步引入后的 router
  .use(directive)
  .use(andtv)
  .use(i18n)
  .use(JetLinksComponents)
  .use(components)
  .mount('#app')
