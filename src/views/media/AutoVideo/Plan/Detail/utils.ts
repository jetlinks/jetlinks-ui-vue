import {inject, provide} from 'vue';
import type { Ref } from 'vue';
import type {Schedule} from "../../typing";
export const DetailKey = Symbol('auto-video-detail')

export const usePlanDetail = () => {
    return inject<Ref<Schedule>>(DetailKey)
}

export const usePlanDetailContent = (detail: Ref<any>) => {
    provide(DetailKey, detail)
}
