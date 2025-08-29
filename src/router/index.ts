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
import microApp from '@micro-zoe/micro-app'
import { createMicroRouterEnhancer } from './micro-router-enhancer'
import { microFrontendConfig } from '@/configs/micro-frontend-config'
import { federationBridge } from '@/utils/micro-federation-bridge'

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
  scrollBehavior(to, form, savedPosition) {
    return savedPosition || {top: 0}
  },
})

// 创建微前端路由增强器
const routerEnhancer = createMicroRouterEnhancer(router)

microApp.router.setBaseAppRouter(router)

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

  if (!Object.keys(UserInfoStore.userInfo).length) {
    // 是否有用户信息
    await UserInfoStore.getUserInfo()
    //
    await SystemStore.queryVersion()
    await SystemStore.getShowThreshold()
    await SystemStore.queryInfo()
    await SystemStore.setMircoData()
  }

  if (!isSubApp && !application.appList.length) { // 是否开启微前端
    await application.queryApplication() // 获取子应用
    
    // 初始化微前端配置
    if (application.appList.length > 0) {
      await microFrontendConfig.initialize(application.appList)
      
      // 注册微前端路由配置
      application.appList.forEach(app => {
        routerEnhancer.registerMicroRoute({
          appId: app.id,
          prefix: `/${app.id}`,
          preload: true,
          preloadStrategy: 'idle' as any
        })
      })
    }
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

// 导出路由增强器实例
export { routerEnhancer }

export default router
