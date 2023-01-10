import type { App } from 'vue'
import AIcon from './AIcon'
import PermissionButton from './PermissionButton/index.vue'
import TitleComponent from "./TitleComponent/index.vue";

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
        app.component('PermissionButton', PermissionButton)
        app.component('TitleComponent', TitleComponent)
    }
}
