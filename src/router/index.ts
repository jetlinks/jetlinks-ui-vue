import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken, removeToken } from '@jetlinks-web/utils'
import { NOT_FIND_ROUTE, LOGIN_ROUTE, OAuth2, OAuthWechat, AccountCenterBind, AUTHORIZE_ROUTE } from './basic'
import {isSubApp} from '@/utils/consts'
import { useApplication, useUserStore, useSystemStore, useMenuStore  } from '@/store'
import { modules } from '@/utils/modules'

let TokenFilterRoute: string[] = [OAuth2.path, AccountCenterBind.path, AUTHORIZE_ROUTE.path]

let FilterPath: string[] = [OAuth2.path, AUTHORIZE_ROUTE.path]

// 获取子模块默认路由
const getModulesRoutes = () => {
  const modulesFiles = modules()
  const _routes: RouteRecordRaw[] = []
  Object.values(modulesFiles).forEach((item: any) => {
    const routes = item.default.getDefaultRoutes?.() || []
    const filter = item.default.getFilterRoutes?.() || []

    _routes.push(...routes)
    TokenFilterRoute.push(...filter)
  })
  return _routes
}


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    LOGIN_ROUTE,
    OAuth2,
    OAuthWechat,
    AccountCenterBind,
    AUTHORIZE_ROUTE,
    ...getModulesRoutes()
  ],
  scrollBehavior(to, from, savedPosition) {
    // 子应用路由变化时通知基座
    if (isSubApp && to.path !== from.path) {
      setTimeout(() => {
        if ((window as any).microApp?.dispatch) {
          (window as any).microApp.dispatch({
            type: 'route-change',
            data: {
              path: to.path,
              from: from.path
            }
          })
        }
      }, 0)
    }

    return savedPosition || {top: 0}
  },
})

const NoTokenJump = (to: any, next: any, isLogin: boolean) => {
  // 登录页，不需要token 的页面直接放行，否则跳转登录页
  if (isLogin || TokenFilterRoute.includes(to.path)) {
    next()
  } else {
    next({path: LOGIN_ROUTE.path})
  }
}

const getRoutesByServer = async (to: any, next: any) => {

  const UserInfoStore = useUserStore()
  const SystemStore = useSystemStore()
  const MenuStore = useMenuStore()
  const application = useApplication()

  if (!Object.keys(UserInfoStore.userInfo).length && !isSubApp) { // 不是微前端的情况下
    // 是否有用户信息
    await UserInfoStore.getUserInfo()
    //
    await SystemStore.queryVersion()
    await SystemStore.getShowThreshold()
    await SystemStore.queryInfo()
  }

  if (isSubApp && !Object.keys(SystemStore.microApp).length) { // 获取基座给的菜单信息
    const data = (window as any).microApp.getData() // 获取主应用下发的数据
    SystemStore.microApp.value = data
    await MenuStore.createRoutes(data.menuResult)

    MenuStore.menu.forEach((r) => {
      router.addRoute(r)
    })
    router.addRoute( NOT_FIND_ROUTE)
    await next({...to, replace: true})
  }

  if (!isSubApp && !application.appList.length) { // 是否开启微前端
    await application.queryApplication() // 获取子应用

    // 初始化微前端配置
    // if (application.appList.length > 0) {
    //   await microFrontendConfig.initialize(application.appList)
    //
    //   // 注册微前端路由配置
    //   application.appList.forEach(app => {
    //     routerEnhancer.registerMicroRoute({
    //       appId: app.id,
    //       prefix: `/${app.id}`,
    //       preload: true,
    //       preloadStrategy: 'idle' as any
    //     })
    //   })
    // }
  }

  // 没有菜单的情况下获取菜单
  if (!MenuStore.menu.length && !FilterPath.includes(to.path as string)) {
    //
    await MenuStore.queryMenus()

    if (!MenuStore.menu) {
      // 请求之后还是没有页面，跳转异常处理页面
      next()
    } else {
      MenuStore.menu.forEach((r) => {
        router.addRoute(r)
      })
      router.addRoute( NOT_FIND_ROUTE)
      await next({...to, replace: true})
    }
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  const token = getToken()
  const isLogin = to.path === LOGIN_ROUTE.path
  if (token) {
    if (isLogin) {
      next({path: '/'})
    } else {
      getRoutesByServer(to, next)
    }
  } else {
    NoTokenJump(to, next, isLogin)
  }
})

export const jumpLogin = () => {
  setTimeout(() => {
    removeToken()
    router.replace({
      path: LOGIN_ROUTE.path,
    })
  })
}

export default router
