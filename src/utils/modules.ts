import {getTargetModule} from "./modules-loader";

export const modules = async () => {
  const modulesMap = {}
  const modulesFiles = await getTargetModule(import.meta.glob('../modules/*/index.ts'), /..\/modules\/(.*?)\/index\.ts/)
  console.log('modulesFiles', modulesFiles)
  return Object.assign(modulesMap, modulesFiles)
}

export const getModulesMenu = async () => {
  const modulesFiles = await getTargetModule(import.meta.glob('../modules/*/baseMenu.ts'), /..\/modules\/(.*?)\/baseMenu\.ts/)
  const menus: any[] = []

  Object.values(modulesFiles).forEach((item: any) => {
    menus.push(...item.default?.())
  })

  return menus
}
