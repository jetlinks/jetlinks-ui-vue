import type { App } from 'vue'
import AIcon from './AIcon'
import PermissionButton from './PermissionButton/index.vue'
import JTable from './Table/index'
import TitleComponent from "./TitleComponent/index.vue";
import Form from './Form';
import CardBox from './CardBox/index.vue';
import Search from './Search'
import NormalUpload from './NormalUpload/index.vue'
import FileFormat from './FileFormat/index.vue'
import JUpload from './JUpload/index.vue'
import { BasicLayoutPage, BlankLayoutPage, PageContainer } from './Layout'

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
            .component('PermissionButton', PermissionButton)
            .component('JTable', JTable)
            .component('TitleComponent', TitleComponent)
            .component('Form', Form)
            .component('CardBox', CardBox)
            .component('Search', Search)
            .component('NormalUpload', NormalUpload)
            .component('FileFormat', FileFormat)
            .component('JUpload', JUpload)
            .component('BasicLayoutPage', BasicLayoutPage)
            .component('BlankLayoutPage', BlankLayoutPage)
            .component('PageContainer', PageContainer)
    }
}
