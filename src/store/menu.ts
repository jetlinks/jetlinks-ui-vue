import { defineStore } from 'pinia'
import { queryOwnThree } from '@/api/system/menu'
import {filterAsyncRouter, filterCommunityMenus, findCodeRoute, MenuItem} from '@/utils/menu'
import { cloneDeep, isArray } from 'lodash-es'
import { usePermissionStore } from './permission'
import router from '@/router'
import { onlyMessage } from '@/utils/comm'
import { AccountMenu, NotificationRecordCode, NotificationSubscriptionCode } from '@/router/menu'
import { MESSAGE_SUBSCRIBE_MENU_CODE, USER_CENTER_MENU_CODE } from '@/utils/consts'
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
      title: string
      parentName: string
      path: string
    }
  }
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
        this.params = { [name]: params || {}}
        router.push({
          name, params, query, state: { params }
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
          let resultData = resp.result
          // if (!isNoCommunity) {
          //   resultData = filterCommunityMenus(resultData)
          // }
          permission.permissions = {}
          const { menusData, silderMenus } = filterAsyncRouter(resultData)

          // 是否存在通知订阅
          const hasMessageSub = resultData.some((item: { code: string }) => item.code === MESSAGE_SUBSCRIBE_MENU_CODE)
          if (!hasMessageSub) {
            AccountMenu.children = AccountMenu.children.filter((item: { code: string }) => ![NotificationSubscriptionCode, NotificationRecordCode].includes(item.code) )
          }
          this.menus = findCodeRoute([...resultData, AccountMenu])
          Object.keys(this.menus).forEach((item) => {
            const _item = this.menus[item]
            if (_item.buttons?.length) {
              permission.permissions[item] = _item.buttons
            }
          })

          menusData.push({
            path: '/',
            redirect: menusData[0]?.path,
            meta: {
              hideInMenu: true
            }
          })
          menusData.push(AccountMenu)
          this.siderMenus = silderMenus.filter((item: { name: string }) => ![USER_CENTER_MENU_CODE, MESSAGE_SUBSCRIBE_MENU_CODE].includes(item.name))
          res(menusData)
        }
      })
    }
  }
})