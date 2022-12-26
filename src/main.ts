import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import components from './components'
import './style.css'
import 'ant-design-vue/es/notification/style/css';

const app = createApp(App)

app.use(store)
app.use(router)
app.use(components)

app.mount('#app')
