import { defineStore } from 'pinia';
import { systemVersion } from '@/api/comm'
import { useMenuStore } from './menu'
import { getDetails_api } from '@/api/system/basis';
import type { ConfigInfoType } from '@/views/system/Basis/typing';

type SystemStateType = {
    isCommunity: boolean;
    configInfo: Partial<ConfigInfoType>;
}

export const useSystem = defineStore('system', {
    state: (): SystemStateType => ({
        isCommunity: false,
        // configInfo: [] as any[]
        configInfo: {}
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
        async getSystemConfig() {
            const params = ['front', 'amap', 'paths'];
            const { status, result } = await getDetails_api(params);
            if (status === 200) {
                params.forEach((key: string) => {
                    this.configInfo[key] = { ...result.find((item: any) => item.scope === key)?.properties }
                })
            }
        }
    }
})