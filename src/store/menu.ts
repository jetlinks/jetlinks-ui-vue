import { defineStore } from "pinia";

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    menus: {} as {[key: string]: string},
  }),
  getters:  {
    hasPermission(state) {
      return (menuCode: string | string[]) => {
        if (!menuCode) {
          return true
        }
        if (!!Object.keys(state.menus).length) {
          if (typeof menuCode === 'string') {
            return !!this.menus[menuCode]
          }
          return menuCode.some(code => !!this.menus[code])
        }
        return false
      }
    }
  }
})