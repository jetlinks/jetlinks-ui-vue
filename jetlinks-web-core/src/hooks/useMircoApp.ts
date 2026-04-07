import { isSubApp } from '@jetlinks-web-core/utils/consts'
import { PlatformName } from '@jetlinks-web-core/utils/consts'

export const useMircoAppData = (key?: string | 'platformName') => {
  let data = ref<Record<string, any>>({
    platformName: inject(PlatformName, 'iot'),
  })

  if (isSubApp) {
    data.value = (window as any).microApp.getGlobalData() || {}
  }

  return {
    data: key ? data.value[key] : data
  }
}
