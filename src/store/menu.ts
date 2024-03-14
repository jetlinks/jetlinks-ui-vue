import { defineStore } from 'pinia'
import { queryOwnThree } from '@/api/system/menu'
import {
  handleMenus,
  MenuItem,
  handleSiderMenu,
  getAsyncRoutesMap, handleMenusMap
} from '@/utils/menu'
import { cloneDeep, isArray } from 'lodash-es'
import { usePermissionStore } from './permission'
import router from '@/router'
import { onlyMessage } from '@/utils/comm'
import { AccountMenu, NotificationRecordCode, NotificationSubscriptionCode } from '@/router/menu'
import { USER_CENTER_MENU_CODE } from '@/utils/consts'
import {isNoCommunity} from "@/utils/utils";

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
          },
        ]
      },
      {
        terms: [
          {
            value: "%show\":true%",
            termType: "like",
            column: "options"
          }
        ],
        type:'and'
      }
    ]
  }
]

type MenuStateType = {
  menus: any
  siderMenus: MenuItem[]
  params: Record<string, any>
}


export const useMenuStore = defineStore({
  id: 'menu',
  state: (): MenuStateType => ({
    menus: {},
    params: {},
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
        this.params = { [name]: params || {} }
        router.push({
          name, params, query, state: { params }
        })
      } else {
        onlyMessage('暂无权限，请联系管理员', 'error')
        console.warn(`没有找到对应的页面: ${name}`)
      }
    },
    routerPush(name: string, params?: Record<string, any>, query?: Record<string, any>) {
      this.params = { [name]: params || {} }
      router.push({
        name, params, query, state: { params }
      })
    },
    handleMenusMapById(item: { name: string, path: string }) {
      const { name, path } = item
      if (name) {
        this.menus[name] = { path }
      }
    },
    queryMenuTree(isCommunity = false): Promise<any[]> {
      return new Promise(async (res) => {
        //过滤非集成的菜单
        const resp = await queryOwnThree({ paging: false, terms: defaultOwnParams })
        if (resp.success) {
          const permission = usePermissionStore()
          let resultData = resp.result
          const components = getAsyncRoutesMap()
          const menusData = handleMenus(cloneDeep(resultData), components)
          permission.handlePermission(resultData)
          const silderMenus = handleSiderMenu(cloneDeep(resultData))
          // const { menusData, silderMenus } = filterAsyncRouter(resultData)
          handleMenusMap(cloneDeep(menusData), this.handleMenusMapById)
          if(!menusData.length){
            menusData.push(AccountMenu)
            this.handleMenusMapById(AccountMenu)
          }
          menusData.push({
            path: '/',
            redirect: menusData[0]?.path,
            meta: {
              hideInMenu: true
            }
          })
         
          // console.log(menusData)
          // menusData.push(AccountMenu)
          this.siderMenus = silderMenus
          res(menusData)
        }
      })
    }
  }
})
