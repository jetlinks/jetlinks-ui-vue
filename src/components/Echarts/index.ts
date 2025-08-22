import Echarts from './Echarts.vue'
import type { App } from 'vue';

Echarts.install = function (app: App) {
  app.component(Echarts.name, Echarts)
}
export default Echarts
