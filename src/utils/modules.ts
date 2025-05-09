export const modules = () => {
  const modulesMap = {}
  const modulesFiles = [
    import.meta.glob('../modules/*/index.ts', { eager: true })
  ]
  return Object.assign(modulesMap, ...modulesFiles)
}

export const getModulesMenu = (): any[] => {
  const modulesFiles = [
    import.meta.glob('../modules/*/baseMenu.ts', {eager: true})
  ]
  const menus: any[] = []

  modulesFiles.forEach(item => {
    const modules = Object.values(item)
    menus.push(...modules.map((m:any) => m.default?.()))
  })

  return menus
}

export const getLang = () => {
  const modulesMap = {}
  const modulesFiles = [
    import.meta.glob('../modules/*/locales/lang/*.json', {eager: true})
  ]
  return Object.assign(modulesMap, ...modulesFiles)
}