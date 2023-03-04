import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
// import jComponents from 'jetlinks-ui-components'
// import 'jetlinks-ui-components/es/style.js'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
  // .use(jComponents)
  .mount('#app')
