import { createApp } from 'vue'
import App from './App.vue'

import pinia from '@/store'
import i18n from '@/locales'
import JetLinksComponents from '@jetlinks-web/components'
import components from './components'
import directive from '@/directive'
import dayjs from 'dayjs'
import { loadMicroApp, initAxios } from '@/package'
import andtv from 'ant-design-vue'

import 'ant-design-vue/dist/antd.variable.min.css'
import 'vue3-json-viewer/dist/index.css'
import '@jetlinks-web/components/es/style/index.less'
import 'xgplayer/dist/index.min.css'
import '@/style/global.less'
import 'dayjs/locale/zh-cn'
import microApp from '@micro-zoe/micro-app'

dayjs.locale('zh-cn')

initAxios()
loadMicroApp()

if (import.meta.env.VITE_MICRO_APP) {
  microApp.start({
    iframe: true
  })
}

// 👇 用 async 包装启动逻辑
async function bootstrap() {
  const router = await import('@/router').then(mod => mod.default)

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
}

bootstrap()
