import { defineStore } from 'pinia';
import { systemVersion } from '@/api/comm'
import { useMenuStore } from './menu'
import {getDetails_api, settingDetail} from '@/api/system/basis';
import type { ConfigInfoType } from '@/views/system/Basis/typing';
import { LocalStore } from '@/utils/comm'
import { SystemConst } from '@/utils/consts'

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
                    LocalStore.set(SystemConst.VERSION_CODE, resp.result.edition)
                    this.isCommunity = isCommunity
                    //  获取菜单
                    const menu = useMenuStore()
                    const menuData: any[] = await menu.queryMenuTree(isCommunity)
                    res(menuData)
                }
            })
        },
        async getFront () {
            const res = await settingDetail('front')
            if (res.success) {
                const ico: any = document.querySelector('link[rel="icon"]');
                ico.href = res.result.ico;
                document.title = res.result.title || '';
                this.configInfo['front'] = res.result
            }
        },
        setDocumentTitle() {
                const _data = this.configInfo['front']
            if (_data) {
                const ico: any = document.querySelector('link[rel="icon"]');
                ico.href = _data.ico;
                document.title = _data.title || '';
            }
        },
        async getSystemConfig() {
            const params = ['front', 'amap', 'paths'];
            const { status, result } = await getDetails_api(params);
            if (status === 200) {
                params.forEach((key: string) => {
                    this.configInfo[key] = { ...result.find((item: any) => item.scope === key)?.properties }
                    // if (key === 'front') {
                    //     const data = result.find((item: any) => item.scope === key).properties
                    //     const ico: any = document.querySelector('link[rel="icon"]');
                    //     ico.href = data.ico;
                    //     document.title = data.title || '';
                    // }
                    this.setDocumentTitle()
                })
            }
        }
    }
})