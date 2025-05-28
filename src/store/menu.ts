import {defineStore} from 'pinia'
import router from '@/router'
import {cloneDeep} from 'lodash-es'
import {setParamsValue} from '@jetlinks-web/hooks'
import {onlyMessage} from '@jetlinks-web/utils'
import {handleMenus, handleMenusMap, handleSiderMenu} from '@/utils'
import {getOwnMenuThree} from '@/api/system/menu'
import {getGlobModules} from '@/router/globModules'
import {getExtraRouters} from '@/router/extraMenu'
import {USER_CENTER_ROUTE, INIT_HOME, EDGE_TOKEN_ROUTE} from '@/router/basic'
import {useAuthStore, useApplication} from '@/store'
import {OWNER_KEY} from "@/utils/consts";
import i18n from "@/locales";
import {BASE_API} from "@jetlinks-web/constants";

const $t = i18n.global.t

const defaultOwnParams = [
    {
        terms: [
            {
                terms: [
                    {
                        column: 'owner',
                        termType: 'eq',
                        value: OWNER_KEY,
                    },
                    {
                        column: 'owner',
                        termType: 'isnull',
                        value: '1',
                        type: 'or',
                    },
                ],
            },
            {
                terms: [
                    {
                        value: "%show\":false%",
                        termType: "nlike",
                        column: "options"
                    }
                ],
                type:'and'
            }
        ],
    },
]

export const useMenuStore = defineStore('menu', () => {
    const menu = ref<any[]>([])
    const menusMap = ref<Map<string, any>>(new Map())
    const siderMenus = ref([])

    const authStore = useAuthStore()
    const app = useApplication();

    const hasRouteMenu = () => {
        return !!Object.keys(menu).length
    }

    const hasMenu = (code: string) => {
        return menusMap.value.has(code)
    }

    /**
     * 页面跳转
     * @param name 路由name
     * @param param1 {Object} 需要传递的参数
     */
    const jumpPage = (
        name: string,
        {
            params,
            query,
        }: {
            params?: Record<string, any>
            query?: Record<string, any>
        },
    ) => {
        if (hasMenu(name)) {
            router.push({name, params, query})
            setParamsValue(name, params)
        } else {
            onlyMessage($t('Home.index.010851-10'), 'warning')
            console.warn(`没有找到对应的页面: ${name}`)
        }
    }
    const routerPush = (
        name: string,
        {
            params,
            query,
        }: {
            params?: Record<string, any>
            query?: Record<string, any>
        },
    ) => {
        router.push({
            name,
            params,
            query,
            state: {params},
        })
        setParamsValue(name, params)
    }
    const handleMenusMapById = (item: { name: string; path: string,meta:any }) => {
        const {name, path,meta} = item
        menusMap.value.set(name, {path,title:meta?.title})
    }

    const queryMenus = async () => {
        const resp = await getOwnMenuThree({
            paging: false,
            terms: defaultOwnParams,
        })

        let menuResult = resp.result

        //  遍历树节点，处理子应用页面

        if (app.appList.length > 0) {

            const handleMicroApp = (nodes: any[]) => {
                if (!nodes || nodes.length === 0) return;

                for (const node of nodes) {
                    // 处理当前节点
                    if (node.children && node.children.length > 0) {
                        // 处理子节点
                        handleMicroApp(node.children);
                    }

                    if(node.options && node.options.appName) {
                        const appInfo = app.findAppById(node.options.appName)

                        let url = appInfo?.path
                        if (url && !url.startsWith('http') && !url.startsWith('/')) {
                            url =  '/' + url
                        }

                        if (url?.startsWith('/')) {
                            url =  BASE_API + url
                        }

                        let isLocal = false

                        if (import.meta.env.DEV) {
                            // isLocal = Object.values(modulesFile).some(v => {
                            //     const localMenus = (v as any).default.getAsyncRoutesMap()
                            //     return localMenus[node.code]
                            // })
                        }

                        if (!isLocal) {
                            node.meta = {
                                appName: node.options.appName,
                                appUrl: url
                            }
                        }
                    }
                }
            }

            // 开始遍历处理
            handleMicroApp(menuResult);

        }

        const asyncRoutes = await getGlobModules()
        menusMap.value.clear()

        if (resp.success) {
            const extraMenu = await getExtraRouters()

            const routes = handleMenus(cloneDeep(menuResult), extraMenu, asyncRoutes) // 处理路由
            if (routes.length) {
                routes.push({
                    path: '/',
                    redirect: routes[0].path,
                })
            }

            routes.push(USER_CENTER_ROUTE) // 添加个人中心
            routes.push(INIT_HOME)
            authStore.handlePermission(menuResult) // 处理按钮权限
            menu.value = routes
            console.log('routes', routes)
            handleMenusMap(routes, handleMenusMapById)
            siderMenus.value = handleSiderMenu(cloneDeep(menuResult)) // 处理菜单
        }
    }

    const getMenu = (name: string) => {
        return menusMap.value.get(name)
    }

    return {
        menu,
        siderMenus,
        menusMap,
        hasRouteMenu,
        hasMenu,
        jumpPage,
        routerPush,
        queryMenus,
        getMenu,
    }
})
