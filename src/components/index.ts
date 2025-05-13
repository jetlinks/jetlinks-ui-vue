import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import CardBox from './CardBox/index.vue';
import Search from './Search'
import AMapComponent from './AMapComponent/AMap.vue'
import PathSimplifier from './AMapComponent/PathSimplifier.vue'
import { BasicLayoutPage, BlankLayoutPage, FullPage } from '@/layout'
import ProUpload from './Upload/index.vue'
import Player from './Player/index.vue'
import BatchDropdown from './BatchDropdown/index.vue'
import ConfirmModal from './ConfirmModal/index.vue'
import CheckButton from './CheckButton/CheckButton.vue'
import SelectAMap from './SelectAMap/index.vue'
import MonacoEditor from './MonacoEditor/monacoEditor.vue'
import FormItemValue from './FormItem'
import { TimeSelect } from './Dashboard/components'
import FullCalendar from './FullCalendar/index.vue'

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
            .component('PathSimplifier', PathSimplifier)
            .component('ProUpload', ProUpload)
            .component('Player', Player)
            .component('BatchDropdown', BatchDropdown)
            .component('ConfirmModal',ConfirmModal)
            .component('CheckButton',CheckButton)
            .component('SelectAMap', SelectAMap)
          .component('monaco-editor', MonacoEditor)
          .component(TimeSelect.name, TimeSelect)
          .component('FullCalendar', FullCalendar)

        Object.keys(FormItemValue).forEach(key => {
            app.component(key, FormItemValue[key])
        })
    }
}
