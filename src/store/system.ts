import { defineStore } from 'pinia';
import { systemVersion } from '@/api/comm'
import { useMenuStore } from './menu'
import { getDetails_api } from '@/api/system/basis';

export const useSystem = defineStore('system', {
  state: () => ({
    isCommunity: false,
    configInfo: [] as any[]
  }),
  actions: {
    getSystemVersion(): Promise<any[]> {
      this.getSystemConfig();
      return new Promise(async (res, rej) => {
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
    },
    getSystemConfig() {
      const params = ['front', 'amap', 'paths'];
      getDetails_api(params).then(({ status, result }: any) => {
        this.configInfo = status === 200 ? [...result] : [];
      })
    }
  }
})