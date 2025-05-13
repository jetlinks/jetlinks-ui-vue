import { MODULES_KEYS } from '@/utils/consts'

const getTargetModule = (modulesFiles: Record<string, any>) => {
  return Object.keys(modulesFiles).filter(
    (key) => MODULES_KEYS.some((modulesKey) => key.includes(modulesKey))
  ).reduce<Record<string, any>>((prev, next) => {
    prev[next] = modulesFiles[next]
    return prev
  }, {})
}

export const getLang = () => {
  const modulesMap = {}
  const modulesFiles = import.meta.glob('../modules/*/locales/lang/*.json', {eager: true})

  if (MODULES_KEYS.length > 0) {
    return getTargetModule(modulesFiles)
  }

  return Object.assign(modulesMap, modulesFiles)
}
