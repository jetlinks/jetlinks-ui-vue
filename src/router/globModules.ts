const routerModules = import.meta.glob('../views/**/index.vue')
const modulesFiles = import.meta.glob('../modules/*/index.ts', { eager: true})
export const getAsyncRoutesMap = () => {
  const modules = {}
  Object.keys(routerModules).forEach(item => {
    const code = item.replace('../views/', '').replace('/index.vue', '')

    modules[code] = routerModules[item]
  })

  return modules
}


export const getGlobModules = () => {
  const asyncRoutesMap = getAsyncRoutesMap()

  Object.keys(modulesFiles).forEach(key => {
    const routes = (modulesFiles[key] as any).default.getAsyncRoutesMap()
    Object.assign(asyncRoutesMap, routes)
  })

  return {
    ...asyncRoutesMap
  }
}
