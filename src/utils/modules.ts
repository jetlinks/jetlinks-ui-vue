const isFilterModule = (item) => {
  return item && item.default.filter === true
}

const getSortModules = () => {
  const modulesFiles = import.meta.glob('../../../modules/*/index.ts', {eager: true})
  return Object.keys(modulesFiles).sort((a, b) => {
    const itemA = modulesFiles[a].default
    const itemB = modulesFiles[b].default
    const priorityA = itemA?.priority || 0
    const priorityB = itemB?.priority || 0
    return priorityA - priorityB
  }).map(key => ({
    key,
    name: key.replace('../../../modules/', '').replace('/index.ts', ''),
    ...modulesFiles[key]
  }))
}

export const modules = () => {
  const modulesMap = {}
  const modulesFiles = getSortModules()
  modulesFiles.forEach((item: any) => {
    if (!isFilterModule(item)) {
      modulesMap[item.key] = item
    }
  })
  return modulesMap
}

export const getModulesMenu = () => {
  const modulesDefaultFiles = getSortModules()
  const modulesFiles = import.meta.glob('../../../modules/*/baseMenu.ts', {eager: true})
  const menus: any[] = []

  modulesDefaultFiles.forEach((item: any) => {
      const defaultName = item.name
      const key = `../../../modules/${defaultName}/baseMenu.ts`
      const baseMenuItem = modulesFiles[key]
      if (baseMenuItem && !isFilterModule(baseMenuItem)) {
        menus.push(...baseMenuItem.default?.())
      }
  })

  return menus
}

export const registerModule = () => {
  const modulesFiles = getSortModules()
  modulesFiles.forEach((item: any ) => {
    if (!isFilterModule(item)) {
      item.default.register?.()
    }
  })
}

export const getModulesInitPage = () => {
  const modulesFiles = getSortModules()
  let initPage
  modulesFiles.forEach((item: any) => {
    if (!isFilterModule(item)) {
      const page = item.default.initPage?.()
      if (page) {
        initPage = page
      }
    }
  })

  return initPage
}

export const getHideHeaderRightConfig = () => {
  const modulesFiles = getSortModules()
  let hideHeaderRight;
  modulesFiles.forEach((item: any) => {
    if (!isFilterModule(item)) {
      hideHeaderRight = item.default.getConfig?.()?.hideHeaderRight ?? false
    }
  })
  return hideHeaderRight
}

export const getPackageConfig = () => {
  const modulesFiles = getSortModules()
  let packageConfig
  modulesFiles.forEach((item: any) => {
    if (!isFilterModule(item)) {
      const config = item.default.getConfig?.()
      if (config) {
        packageConfig = config
      }
    }
  })
  return packageConfig
}
