import {onBeforeUnmount, Ref} from "vue";
import ResizeObserver from "resize-observer-polyfill";
import {debounce} from "lodash-es";

export const useResizeObserver = (tableWrapper: Ref<HTMLElement>, cb: Function) => {

    let observer: ResizeObserver

    const onResize = (e: any[]) => {
        let rect = {}
        for (const entry of e) {
            rect = entry.contentRect;
        }

        cb(rect, e)
    }

    onMounted(() => {
        observer = new ResizeObserver(debounce(onResize, 100))
        observer.observe(tableWrapper.value)
    })

    onBeforeUnmount(() => {
        observer?.unobserve(tableWrapper.value)
    })
}
