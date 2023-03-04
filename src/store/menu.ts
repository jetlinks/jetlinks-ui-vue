import { defineStore } from 'pinia'
import { queryOwnThree } from '@/api/system/menu'
import { filterAsnycRouter, MenuItem } from '@/utils/menu'
import { isArray } from 'lodash-es'
import { usePermissionStore } from './permission'
import router from '@/router'
import { onlyMessage } from '@/utils/comm'
import { AccountMenu } from '@/router/menu'

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
        onlyMessage('暂无权限，请联系管理员', 'error')
        console.warn(`没有找到对应的页面: ${name}`)
      }
    },
    queryMenuTree(isCommunity = false): Promise<any[]> {
      return new Promise(async (res) => {
        //过滤非集成的菜单
        const resp = await queryOwnThree({ paging: false, terms: defaultOwnParams })
        if (resp.success) {
          const permission = usePermissionStore()
          permission.permissions = {}
          const { menusData, silderMenus } = filterAsnycRouter(resp.result)
          this.menus = {}
          const handleMenuItem = (menu: any) => {
            if (isArray(menu)) {
              menu.forEach(menuItem => {
                this.menus[menuItem.name] = {
                  path: menuItem.path,
                  buttons: menuItem.meta.buttons
                }
                permission.permissions[menuItem.name] = menuItem.meta.buttons
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
          menusData.push(AccountMenu)
          silderMenus.push(AccountMenu)
          this.siderMenus = silderMenus
          console.log('menusData', menusData)
          console.log('silderMenus', silderMenus)
          res(menusData)
        }
      })
    }
  }
})