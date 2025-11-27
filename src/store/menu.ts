import { defineStore } from 'pinia'
import router from '@/router'
import { cloneDeep } from 'lodash-es'
import { setParamsValue } from '@jetlinks-web/hooks'
import { onlyMessage } from '@jetlinks-web/utils'
import { handleMenus, modules } from '@/utils'
import { getOwnMenuThree } from '@/api/system/menu'
import { getDefaultModules, getGlobModules } from '@/router/globModules'
import { getExtraRouters } from '@/router/extraMenu'
import { USER_CENTER_ROUTE, INIT_HOME } from '@/router/basic'
import { useAuthStore, useApplication } from '@/store'
import { OWNER_KEY } from '@/utils/consts'
import i18n from '@/locales'
import { BASE_API } from '@jetlinks-web/constants'
import type { RouteRecordRaw } from 'vue-router'

const $t = i18n.global.t

const defaultOwnParams = [
  {
    terms: [
      {
        terms: [
          {
            column: 'owner',
            termType: 'eq',
            value: OWNER_KEY
          },
          {
            column: 'owner',
            termType: 'isnull',
            value: '1',
            type: 'or'
          }
        ]
      },
      {
        terms: [
          {
            value: '%show":false%',
            termType: 'nlike',
            column: 'options'
          }
        ],
        type: 'and'
      }
    ]
  }
]

export const useMenuStore = defineStore('menu', () => {
  const menusMap = ref<Map<string, any>>(new Map())
  const menu = ref<RouteRecordRaw[]>([])
  const siderMenus = ref<RouteRecordRaw[]>([])
  const menuResultCache = ref<any[]>([])
  const loading = ref(true)
  const authStore = useAuthStore()
  const app = useApplication()

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
      query
    }: {
      params?: Record<string, any>
      query?: Record<string, any>
    }
  ) => {
    if (hasMenu(name)) {
      router.push({ name, params, query })
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
      query
    }: {
      params?: Record<string, any>
      query?: Record<string, any>
    }
  ) => {
    router.push({
      name,
      params,
      query,
      state: { params }
    })
    setParamsValue(name, params)
  }
  const handleMenusMapById = (item: { name: string; path: string; meta: any }) => {
    const { name, path, meta } = item
    menusMap.value.set(name, { path, title: meta?.title })
  }

  const createRoutes = async (menuResult: any[]) => {
    menusMap.value.clear()
    const asyncRoutes = await getGlobModules()
    const extraMenu = await getExtraRouters()
    const defaultRoutes = getDefaultModules()

    const { menuRoutes, menuMap, menus, authButtons } = handleMenus(cloneDeep(menuResult), extraMenu, asyncRoutes) // 处理路由

    menuRoutes.push(USER_CENTER_ROUTE) // 添加个人中心
    menuRoutes.push(INIT_HOME)

    if (menuRoutes.length) {
      menuRoutes.push({
        path: '/',
        redirect: menuRoutes[0].path
      })
    }

    // authStore.handlePermission(menuResult) // 处理按钮权限
    // 添加模块默认路由映射
    defaultRoutes?.forEach((item: any) => {
      menuMap.set(item.name, { path: item.path!, title: item.meta?.title as string })
    })

    console.log('routes', menuRoutes)
    console.log('menus', menus)
    menusMap.value = menuMap
    menu.value = menuRoutes
    siderMenus.value = menus // 处理菜单
    authStore.setPermissionsAll(authButtons)
  }

  const queryMenus = async () => {
    const resp = await getOwnMenuThree({
      paging: false,
      terms: defaultOwnParams,
      sorts: [{ name: 'sortIndex', order: 'asc' }]
    })

    let menuResult = resp.result
    menuResultCache.value = JSON.parse(JSON.stringify(resp.result))

    //  遍历树节点，处理子应用页面

    if (app.appList.length > 0) {
      const handleMicroApp = (nodes: any[]) => {
        if (!nodes || nodes.length === 0) return

        for (const node of nodes) {
          // 处理当前节点
          if (node.children && node.children.length > 0) {
            // 处理子节点
            handleMicroApp(node.children)
          }

          if (node.options && node.options.appName) {
            const appInfo = app.findAppById(node.options.appName)

            let url = appInfo?.path
            if (url && !url.startsWith('http') && !url.startsWith('/')) {
              url = '/' + url
            }

            if (url?.startsWith('/')) {
              url = BASE_API + url
            }

            let isLocal = false

            if (import.meta.env.DEV) {
              const modulesFile = modules()
              isLocal = Object.values(modulesFile).some((v) => {
                const localMenus = (v as any).default.getAsyncRoutesMap()
                return localMenus[node.code]
              })
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
      handleMicroApp(menuResult)
    }

    if (resp.success) {
      await createRoutes(menuResult)
      loading.value = false
    }
  }

  const getMenu = (name: string) => {
    return menusMap.value.get(name)
  }

  return {
    menu,
    siderMenus,
    menusMap,
    loading,
    menuResultCache,
    hasRouteMenu,
    hasMenu,
    jumpPage,
    routerPush,
    queryMenus,
    getMenu,
    createRoutes
  }
})
