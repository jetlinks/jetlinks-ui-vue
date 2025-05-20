import {modules} from '@/utils/modules'

export const getExtraRouters = async () => {
  const extraMenu = {

  }

  const modulesFiles = modules()
  Object.values(modulesFiles).forEach(item => {
    const routes = item.default.getExtraRoutesMap?.() || []
    Object.assign(extraMenu, routes)
  })
  return extraMenu
}
