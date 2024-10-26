import { defineStore } from 'pinia';
import { systemVersion } from '@/api/comm'
import { useMenuStore } from './menu'
import {getDetails_api, settingDetail} from '@/api/system/basis';
import { queryProductThreshold } from '@/api/device/instance'
import type { ConfigInfoType } from '@/views/system/Basis/typing';
import { LocalStore } from '@/utils/comm'
import { SystemConst } from '@/utils/consts'
import {
    getTagsColor,
} from '@/api/system/calendar'
import Config from '../../config/config'

type SystemStateType = {
    isCommunity: boolean;
    configInfo: Partial<ConfigInfoType>;
    layout:{
        siderWidth: string | number | undefined; // 左侧菜单栏宽度
        headerHeight: string | number | undefined; // 头部高度
        collapsedWidth: string | number | undefined;
    },
    basicLayout: {
        selectedKeys: string[],
        openKeys: string[],
        collapsed: boolean
        pure: boolean
    }
    calendarTagColor:Map<string,string>
    showThreshold:boolean
}

export const useSystem = defineStore('system', {
    state: (): SystemStateType => ({
        isCommunity: false,
        // configInfo: [] as any[]
        configInfo: {},
        layout:{
            siderWidth: 208, // 左侧菜单栏宽度
            headerHeight: 60, // 头部高度
            collapsedWidth: 48,
        },
        basicLayout: {
            selectedKeys: [],
            openKeys: [],
            collapsed: false,
            pure: false
        },
        calendarTagColor:new Map([['holiday','rgb(161, 180, 204)'],['weekend','rgb(149, 222, 100)'],['workday', 'rgba(105,177,255)']]),
        showThreshold: true
    }),
    actions: {
        getSystemVersion(): Promise<any[]> {
            this.getSystemConfig();
            this.getThreshold()
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
                ico.href = res.result.ico || Config.logo;
                document.title = res.result.title || Config.title;
                this.configInfo['front'] = res.result
            }
        },
        setDocumentTitle() {
                const _data = this.configInfo['front']
            if (_data) {
                const ico: any = document.querySelector('link[rel="icon"]');
                ico.href = _data.ico || Config.logo;
                document.title = _data.title || Config.title;
            }
        },
        async getSystemConfig() {
            const params = ['front', 'amap', 'paths','media'];
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
        },
        async getTagsColor(){
            const answer:any = await getTagsColor();
            if (answer.success) {
                Object.keys(answer.result).forEach((i) => {
                    this.calendarTagColor.set(i, answer.result[i]);
                });
            }
        },
        async getThreshold(){
            await queryProductThreshold('test','test',true).catch((res:any)=>{
                if(res.response.status === 404){
                    this.showThreshold = false
                }
            })
        }
    }
})
