import { defineStore } from 'pinia';
import { systemVersion } from '@/api/comm'
import { useMenuStore } from './menu'

export const useSystem = defineStore('system', {
  state: () => ({
    isCommunity: false
  }),
  actions: {
    getSystemVersion(): Promise<any[]> {
      return new Promise(async(res, rej) => {
        const resp = await systemVersion()
        if (resp.success && resp.result) {
          const isCommunity = resp.result.edition === 'community'
          this.isCommunity = isCommunity
          //  获取菜单
          const menu = useMenuStore()
          const menuData: any[] = await menu.queryMenuTree(isCommunity)
          res(menuData)
        }
      })
    }
  }
})