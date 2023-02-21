import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
import 'ant-design-vue/es/notification/style/css';
// import jConmonents from 'jetlinks-ui-components'
// import 'jetlinks-ui-components/lib/style'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
  // .use(jConmonents)
  .mount('#app')
