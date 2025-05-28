import { MODULES_KEYS } from '@/utils/consts'

// const MODULES_KEYS = ['device-manager-ui']

export const getTargetModule = async (modulesFiles: Record<string, any>, regexp: RegExp) => {
  const targetModules: Record<string, any> = {}
  for (const path in modulesFiles) {
    const match = path.match(regexp);
    const moduleName = match?.[1];
    if (MODULES_KEYS.length > 0 && moduleName && !MODULES_KEYS.includes(moduleName)) {
      continue;
    }
    targetModules[path] = modulesFiles[path]()
  }

  return targetModules
}
