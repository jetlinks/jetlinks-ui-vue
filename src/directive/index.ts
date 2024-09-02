import type { App } from 'vue'
import formatTime from './formatTime'

export default {
    install(app: App) {
        app.use(formatTime)
    }
}
