import type { App } from 'vue'
import dayjs from 'dayjs'

function formatTime(app: App) {
    app.directive("time-format", {
        mounted(el: HTMLElement, bindings) {
            const _timeStamps = Number(el.textContent)
            el.textContent = !isNaN(_timeStamps) ? dayjs(_timeStamps).format(bindings.value) : el.textContent;
        },
        updated(el: HTMLElement, bindings) {
            const _timeStamps = Number(el.textContent)
            el.textContent = !isNaN(_timeStamps) ? dayjs(_timeStamps).format(bindings.value) : el.textContent;
        }
    })
}

export default formatTime
