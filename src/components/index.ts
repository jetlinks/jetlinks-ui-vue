import type { App } from 'vue'
import AIcon from './AIcon'

export default  {
    install(app: App) {
        app.component('AIcon', AIcon)
    }
}
