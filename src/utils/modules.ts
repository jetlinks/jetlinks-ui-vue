export const modules = () => {
  const modulesMap = {}
  const modulesFiles = import.meta.glob('../modules/*/index.ts', {eager: true})
  // const modulesFiles = import.meta.glob(import.meta.env.VITE_MODULE_GLOB, {eager: true})
  return Object.assign(modulesMap, modulesFiles)
}

export const getModulesMenu = () => {
  const modulesFiles = import.meta.glob('../modules/*/baseMenu.ts', {eager: true})
  // const modulesFiles = import.meta.glob(import.meta.env.VITE_MODULE_MENU_GLOB, {eager: true})
  const menus: any[] = []

  Object.values(modulesFiles).forEach((item: any) => {
    menus.push(...item.default?.())
  })

  return menus
}

export const registerModule = () => {
  const modulesFiles = import.meta.glob('../modules/*/index.ts', {eager: true})
  Object.values(modulesFiles).forEach((item: any) => {
    item.default.register?.()
  })
}
