import { provide } from 'vue'
export const pluginPermissionKey = 'plugin-permission-key'

export const usePluginPermissionContext = (key: string) => {
  provide(pluginPermissionKey, key)
}

export const usePluginPermission = () => {
  return inject(pluginPermissionKey, 'link/plugin')
}
