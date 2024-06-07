import type { App } from 'vue'
import PermissionButton from './PermissionButton/index.vue'
import JTable from './Table/index'
import TitleComponent from "./TitleComponent/index.vue";
import Form from './Form';
import CardBox from './CardBox/index.vue';
import Search from './Search'
import NormalUpload from './NormalUpload/index.vue'
import FileFormat from './FileFormat/index.vue'
import JProUpload from './Upload/index.vue'
import { BasicLayoutPage, BlankLayoutPage, FullPage } from './Layout'
import RadioCard from './RadioCard/index.vue'
import { PageContainer, AIcon, Ellipsis } from 'jetlinks-ui-components'
import MarkDown from './Markdown'
// import Ellipsis from './Ellipsis/index.vue'
import JEmpty from './Empty/index.vue'
import AMapComponent from './AMapComponent/index.vue'
import PathSimplifier from './AMapComponent/PathSimplifier.vue'
import ValueItem from './ValueItem/index.vue'
import RowPagination from './RowPagination/index.vue'
import Calendar from './Calendar/index.vue'

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
            .component('PermissionButton', PermissionButton)
            .component('JTable', JTable)
            .component('TitleComponent', TitleComponent)
            .component('Form', Form)
            .component('CardBox', CardBox)
            .component('ProSearch', Search)
            .component('NormalUpload', NormalUpload)
            .component('FileFormat', FileFormat)
            .component('JProUpload', JProUpload)
            .component('BasicLayoutPage', BasicLayoutPage)
            .component('BlankLayoutPage', BlankLayoutPage)
            .component('PageContainer', PageContainer)
            .component('Ellipsis', Ellipsis)
            .component('JEmpty', JEmpty)
            .component('AMapComponent', AMapComponent)
            .component('PathSimplifier', PathSimplifier)
            .component('ValueItem', ValueItem)
            .component('RowPagination', RowPagination)
            .component('FullPage', FullPage)
            .component('RadioCard', RadioCard)
            .component('MarkDown', MarkDown)
            .component('Calendar',Calendar)
    }
}
