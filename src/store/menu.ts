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


export const useMenuStore = defineStore({
  id: 'menu',
  state: (): MenuStateType => ({
    menus: {},
    siderMenus: []
  }),
  getters: {
    hasPermission(state) {
      return (code: string | string[]) => {
        if (!code) {
          return true
        }
        if (!!Object.keys(state.menus).length) {
          let codes: string[] = []

          if (typeof code === 'string') {
            codes.push(code)
          } else {
            codes = code
          }

          return codes.some(_c => {
            const menu_code = _c.split(':')
            if (menu_code.length > 1) {
              return !!this.menus[menu_code[0]]?.buttons?.includes(menu_code[1])
            }
            return false
          })
        }
        return false
      }
    }
  },
  actions: {
    hasMenu(code: string) {
      return this.menus[code]?.path
    },
    /**
     * 路由跳转
     * @param name 菜单code
     * @param params 路由参数
     * @param query 路由参数
     */
    jumpPage(name: string, params?: Record<string, any>, query?: Record<string, any>) {
      const path = this.hasMenu(name)
      if (path) {
        router.push({
          name, params, query
        })
      } else {
        console.warn(`没有找到对应的页面: ${name}`)
      }
    },
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
                this.menus[menuItem.name] = {
                  path: menuItem.path,
                  buttons: menuItem.meta.buttons
                }
                if (menuItem.children && menuItem.children.length) {
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
          console.log('menusData', menusData)
          res(menusData)
        }
      })
    }
  }
})