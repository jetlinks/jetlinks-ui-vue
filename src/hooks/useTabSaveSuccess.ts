import { randomString } from '@jetlinks-web/utils'
import { isSubApp } from '@/utils/consts'
import { useMenuStore } from '@/store'

type OptionsType = {
  onSuccess?: (value: any) => void
}

/**
 *
 * @param code 目标菜单code
 * @param options
 */
export const useTabSaveSuccess = (code: string = '', options?: OptionsType) => {
  const id = ref('tab-save-success' + randomString(8))
  const menuStore = useMenuStore()
  const tabInstance = ref<WindowProxy | null>(null)

  function formatPath(str: string, obj: Record<string, string>) {
    return str.replace(/:([a-zA-Z_]\w*)/g, (_, key) => {
      return obj.hasOwnProperty(key) ? obj[key] : ''
    })
  }

  const onOpen = (
    params: Record<string, any>,
    _options: {
      menuCode?: string
      menuParams?: Record<string, any>
    } = {}
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const menuItem = menuStore.getMenu(_options.menuCode || code)

      if (!menuItem?.path) {
        reject('path not found')
        return
      }

      const _params = new URLSearchParams({ ...params, sourceId: id.value })
      const hash = location.hash ? '/#' : ''
      const path = _options.menuParams ? formatPath(menuItem.path, _options.menuParams) : menuItem.path
      const url = [location.origin, hash, path, '?', _params.toString()].join('')

      if (isSubApp) {
        // 微前端
        const globalData = (window as any).microApp.getGlobalData() as { api: Record<string, any> }
        if (globalData?.api?.onTabSaveSuccess) {
          globalData.api.onTabSaveSuccess(id.value, url, options)
        }
      } else {
        tabInstance.value = window.open(url) as WindowProxy
        ;(tabInstance.value as any).onTabSaveSuccess = (_sourceId: string, value: any) => {
          if (_sourceId === id.value) {
            options?.onSuccess?.(value)
            resolve(value)
          }
        }
        resolve(tabInstance.value)
      }
    })
  }

  return {
    onOpen,
    tabInstance
  }
}

export const useTabSaveSuccessBack = () => {
  const route = useRoute()

  const onBack = async (data?: any, options?: { onBefore?: () => boolean | Promise<boolean> }) => {
    const sourceId = route.query?.sourceId
    let globalData
    if (sourceId) {
      const isClose = options?.onBefore ? await options.onBefore() : true
      if (isClose) {
        if (isSubApp) {
          globalData = (window as any).microApp.getGlobalData() as { api: Record<string, any> }
          if (globalData?.api?.onTabSaveSuccessBack) {
            globalData.api.onTabSaveSuccessBack(sourceId, data)
          }
        } else if ((window as any).onTabSaveSuccess) {
          ;(window as any).onTabSaveSuccess(sourceId, data)
          setTimeout(() => window.close(), 300)
        }
      }
    }
    return !!sourceId && (!!(window as any).onTabSaveSuccess || !!(isSubApp && globalData?.api?.onTabSaveSuccessBack))
  }

  return {
    onBack
  }
}
