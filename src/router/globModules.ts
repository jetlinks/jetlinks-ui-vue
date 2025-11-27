import { modules } from '@/utils/modules'

const routerModules = import.meta.glob('../views/**/index.vue')

export const getAsyncRoutesMap = () => {
  const modulesMap: Record<string, any> = {}
  Object.keys(routerModules).forEach((item) => {
    const code = item.replace('../views/', '').replace('/index.vue', '')
    modulesMap[code] = routerModules[item]
  })

  return modulesMap
}

export const getGlobModules = async () => {
  const asyncRoutesMap = getAsyncRoutesMap()

  const modulesFiles = modules()
  Object.values(modulesFiles).forEach((item) => {
    const routes = item.default.getAsyncRoutesMap?.() || []
    Object.assign(asyncRoutesMap, routes)
  })

  return {
    ...asyncRoutesMap
  }
}

export const getDefaultModules = (tokenFilterRoute?: any) => {
  const modulesFiles = modules()
  const _modules: any[] = []
  Object.values(modulesFiles).forEach((item) => {
    const modules = item.default.getDefaultRoutes?.() || []
    const filter = item.default.getFilterRoutes?.() || []
    _modules.push(...modules)
    tokenFilterRoute && tokenFilterRoute.push(...filter)
  })
  return _modules
}
