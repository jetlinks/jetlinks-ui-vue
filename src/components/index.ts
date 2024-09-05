import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import CardBox from './CardBox/index.vue';
import Search from './Search'
import AMapComponent from './AMapComponent/AMap.vue'
import { BasicLayoutPage, BlankLayoutPage, FullPage } from '@/layout'
import ProUpload from './Upload/index.vue'
import Player from './Player/index.vue'
import BatchDropdown from './BatchDropdown/index.vue'
import ConfirmModal from './ConfirmModal/index.vue'
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
            .component('ProUpload', ProUpload)
            .component('Player', Player)
            .component('BatchDropdown', BatchDropdown)
            .component('ConfirmModal',ConfirmModal)
    }
}
