import { defineStore } from "pinia";
import { queryOwnThree } from '@/api/system/menu'
import { filterAsnycRouter } from '@/utils/menu'

export const useMenuStore = defineStore({
  id: 'menu',
  state: () => ({
    menus: {},
    menusKey: []
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
    },
  },
  actions: {
    queryMenuTree(isCommunity = false): Promise<any[]> {
      return new Promise(async (res) => {
        //过滤非集成的菜单
        const params = [
          {
            terms: [
              {
                terms: [
                  {
                    column: 'owner',
                    termType: 'eq',
                    value: 'iot',
                  },
                  {
                    column: 'owner',
                    termType: 'isnull',
                    value: '1',
                    type: 'or',
                  },
                ],
              },
            ],
          },
        ];
        const resp = await queryOwnThree({ paging: false, terms: params })
        if (resp.success) {
          const menus = filterAsnycRouter(resp.result)
          menus.push({
            path: '/',
            redirect: menus[0]?.path,
            meta: {
              hideInMenu: true
            }
          })
          this.menus = menus
          res(menus)
        }
      })
    }
  }
})