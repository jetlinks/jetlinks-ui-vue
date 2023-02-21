import { defineStore } from 'pinia'
import { queryOwnThree } from '@/api/system/menu'
import { filterAsnycRouter, MenuItem } from '@/utils/menu'
import { isArray } from 'lodash-es'
import router from '@/router'

const defaultOwnParams = [
  {
    terms: [
      {
        terms: [
          {
            column: 'owner',
            termType: 'eq',
            value: 'iot'
          },
          {
            column: 'owner',
            termType: 'isnull',
            value: '1',
            type: 'or'
          }
        ]
      }
    ]
  }
]

type MenuStateType = {
  menus: {
    [key: string]: {
      buttons?: string[]
      path: string
    }
  }
  siderMenus: MenuItem[]
}

// export const useMenusStore = defineStore('menu', () => {
//   const state = reactive<MenuStateType>({
//     menus: {},
//     siderMenus: []
//   })
//
//   const hasPermission = (code: string | string[]) => {
//     if (!code || !(code as string[]).length) {
//       console.warn(`function hasPermission: 没有传入${code}`)
//       return false
//     }
//
//   }
//
//   const queryMenuTree = (): Promise<any[]> => {
//
//   }
//
//   return {
//     state,
//     hasPermission,
//     queryMenuTree
//   }
// })

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    menus: {},
    siderMenus: []
  }),
  getters: {
    hasPermission(state) {
      return (menuCode: string | string[]) => {
        if (!menuCode) {
          return true
        }
        if (!!Object.keys(state.menus).length) {
          if (typeof menuCode === 'string') {
            return !!this.menus[menuCode].buttons
          }
          return menuCode.some(code => !!this.menus[code])
        }
        return false
      }
    }
  },
  actions: {
    queryMenuTree(isCommunity = false): Promise<any[]> {
      return new Promise(async (res) => {
        //过滤非集成的菜单
        const resp = await queryOwnThree({ paging: false, terms: defaultOwnParams })
        if (resp.success) {
          const { menusData, silderMenus } = filterAsnycRouter(resp.result)
          this.menus = {}
          const handleMenuItem = (menu: any) => {
            if (isArray(menu)) {
              menu.forEach(menuItem => {
                this.menus[menuItem.code] = {
                  path: menuItem.path,
                  buttons: menuItem.buttons
                }
                if (menuItem.children && menuItem.length) {
                  handleMenuItem(menuItem.children)
                }
              })
            }
          }

          handleMenuItem(menusData)
          menusData.push({
            path: '/',
            redirect: menusData[0]?.path,
            meta: {
              hideInMenu: true
            }
          })
          this.siderMenus = silderMenus
          console.log('silderMenus', silderMenus)
          res(menusData)
        }
      })
    }
  }
})