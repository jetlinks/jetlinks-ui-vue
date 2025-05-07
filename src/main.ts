import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import pinia from '@/store'
import i18n from '@/locales'
import JetlinksComponents from '@jetlinks-web/components'
import components from './components'
import directive from '@/directive'
import dayjs from 'dayjs';
import { loadMicroApp, initAxios } from "@/package";
import andtv from 'ant-design-vue'

import 'ant-design-vue/dist/antd.variable.min.css'
import "vue3-json-viewer/dist/index.css";
import '@jetlinks-web/components/es/style/index.less'
import 'xgplayer/dist/index.min.css'
import '@/style/global.less'
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

initAxios()
loadMicroApp()

const app = createApp(App)

app.use(pinia)
    .use(router)
    .use(directive) // 注册自定义指令
    .use(i18n)
    .use(andtv)
    .use(JetlinksComponents) // 注册脚手架通用组件
    .use(components) // 注册自定义通用组件
    .mount('#app')
