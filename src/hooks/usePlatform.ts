import {provide, inject} from "vue";
import { PlatformName } from '@jetlinks-web-core/utils/consts'

export const usePlatformContext = (platform = 'iot') => {
    provide(PlatformName, platform)
}
export const usePlatform = () => {
    return inject(PlatformName, 'iot')
}

export const isIotPlatform = () => {
    return usePlatform() === 'iot'
}
