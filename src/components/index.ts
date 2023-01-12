import type { App } from 'vue'
import AIcon from './AIcon'
import PermissionButton from './PermissionButton/index.vue'
import JTable from './Table/index'
import TitleComponent from "./TitleComponent/index.vue";
import Form from './Form';
import CardBox from './CardBox/index.vue';

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
            .component('PermissionButton', PermissionButton)
            .component('JTable', JTable)
            .component('TitleComponent', TitleComponent)
            .component('Form', Form)
            .component('CardBox', CardBox)
    }
}
