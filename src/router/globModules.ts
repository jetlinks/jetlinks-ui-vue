import { modules } from '@jetlinks-web-core/utils/modules'
import type { ModuleRouteOverride } from './types'

const routerModules = import.meta.glob('../views/**/index.vue')

export const getAsyncRoutesMap = () => {
  const modulesMap: Record<string, any> = {}
  Object.keys(routerModules).forEach(item => {
    const code = item.replace('../views/', '').replace('/index.vue', '')
    modulesMap[code] = routerModules[item]
  })

  return modulesMap
}

export const getGlobModules = async () => {
  const asyncRoutesMap = getAsyncRoutesMap()

  const modulesFiles = modules()
  Object.values(modulesFiles).forEach(item => {
    const routes = item.default.getAsyncRoutesMap?.() || []
    Object.assign(asyncRoutesMap, routes)
  })

  return {
    ...asyncRoutesMap
  }
}

/**
 * Legacy compatibility API for collecting module route overrides.
 *
 * @deprecated Use `collectCoreRouteOverrides()` instead.
 * `getDefaultModules()` and `tokenFilterRoute` are kept only for backward compatibility.
 */
export const getDefaultModules = (tokenFilterRoute?: any) => {
  const modulesFiles = modules()

  if (tokenFilterRoute) {
    Object.values(modulesFiles).forEach((item: any) => {
      const filter = item.default.getFilterRoutes?.() || []
      tokenFilterRoute.push(...filter)
    })
  }

  return collectCoreRouteOverrides()
}

/**
 * Collect all module core-route overrides sorted by module priority.
 */
export function collectCoreRouteOverrides(): ModuleRouteOverride[] {
  const modulesFiles = modules()
  const overrides: ModuleRouteOverride[] = []

  Object.values(modulesFiles).forEach((item: any) => {
    const moduleOverrides = item.default.getCoreRouteOverrides?.() || []
    if (moduleOverrides.length > 0) {
      overrides.push(...moduleOverrides)
    }
  })

  return overrides
}
