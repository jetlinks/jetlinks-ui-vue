import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import CardBox from './CardBox/index.vue';
import Search from './Search'
import AMapComponent from './AMapComponent/AMap.vue'
import { BasicLayoutPage, BlankLayoutPage, FullPage } from '@/layout'

export default {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
            .component('ImageUpload', ImageUpload)
            .component('CardBox', CardBox)
            .component('ProSearch', Search)
            .component('BasicLayoutPage', BasicLayoutPage)
            .component('BlankLayoutPage', BlankLayoutPage)
            .component('FullPage', FullPage)
            .component('AMapComponent', AMapComponent)
    }
}
