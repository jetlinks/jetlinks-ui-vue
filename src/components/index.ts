import type { App } from 'vue'
import AIcon from './AIcon'
import PermissionButton from './PermissionButton/index.vue'
import JTable from './Table/index'

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
        app.component('PermissionButton', PermissionButton)
        app.component('JTable', JTable)
    }
}
