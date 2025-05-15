import { getTargetModule } from '@/utils/modules-loader'


export const getLang = async () => {
  const modulesMap = {}
  const modulesFiles = await getTargetModule(import.meta.glob('../modules/*/locales/lang/*.json'), /..\/modules\/(.*?)\/locales\/lang\/(.*?)\.ts/)

  return Object.assign(modulesMap, modulesFiles)
}
