import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
import 'ant-design-vue/es/notification/style/css';

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
  .mount('#app')
