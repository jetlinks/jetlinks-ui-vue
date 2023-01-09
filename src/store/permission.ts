import { defineStore } from "pinia";
import type { MENUS_CODE_TYPE, BUTTON_PERMISSION } from '@/router/router'

export const usePermissionStore = defineStore({
  id: 'permission',
  state: () => ({
    permissions: {} as {[key: MENUS_CODE_TYPE]: BUTTON_PERMISSION},
  }),
  getters:  {
    check(state) {
      return (permissionCode: string) => {
        if (!permissionCode) {
          return true
        }
        if (!permissionCode.includes(":")) {
          return false
        }
        const code = permissionCode.split(":")[0]
        const value = permissionCode.split(":")[1]
        const _buttonArray = state.permissions[code]
        if (!_buttonArray) {
          return false
        }
        return _buttonArray.includes(value)
      }
    },
    hasPermission(state) {
      return (permissionCode: string | string[]) => {
        if (!permissionCode) {
          return true
        }
        if (!!Object.keys(state.permissions).length) {
          if (typeof permissionCode === 'string') {
            return this.check(permissionCode)
          }
          return permissionCode.some(_permissionCode => this.check(_permissionCode))
        }
        return false
      }
    }
  }
})