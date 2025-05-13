import { MODULES_KEYS } from '@/utils/consts'

const getTargetModule = (modulesFiles: Record<string, any>) => {
  return Object.keys(modulesFiles).filter(
    (key) => MODULES_KEYS.some((modulesKey) => key.includes(modulesKey))
  ).reduce<Record<string, any>>((prev, next) => {
    prev[next] = modulesFiles[next]
    return prev
  }, {})
}

export const modules = () => {
  const modulesMap = {}
  const modulesFiles = import.meta.glob('../modules/*/index.ts', { eager: true })
  if (MODULES_KEYS.length > 0) {
    return getTargetModule(modulesFiles)
  }

  return Object.assign(modulesMap, modulesFiles)
}

export const getModulesMenu = (): any[] => {
  const modulesFiles = import.meta.glob('../modules/*/baseMenu.ts', { eager: true })
  const menus: any[] = []

  Object.keys(modulesFiles).forEach(key => {
    if (MODULES_KEYS.length > 0) {
      if (MODULES_KEYS.some((modulesKey) => key.includes(modulesKey))) {
        const modules = Object.values(modulesFiles[key])
        menus.push(...modules.map((m:any) => m.default?.()))
      }
    } else {
      const modules = Object.values(modulesFiles[key])
      menus.push(...modules.map((m:any) => m.default?.()))
    }
  })

  return menus
}
