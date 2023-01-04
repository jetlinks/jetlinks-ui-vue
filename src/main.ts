import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import components from './components'
import './style.css'
import 'ant-design-vue/es/notification/style/css';
import Antd from 'ant-design-vue/es'

// 地图
import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'
initAMapApiLoader({
  // key: '95fa72137f4263f8e64ae01f766ad09c',
  key: 'a0415acfc35af15f10221bfa5a6850b4',
  securityJsCode: 'cae6108ec3dd222f946d1a7237c78be0'
})

const app = createApp(App)

app.use(store)
app.use(router)
app.use(components)
app.use(Antd)
app.use(VueAMap)

app.mount('#app')
