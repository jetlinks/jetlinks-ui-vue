import {
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken, removeToken } from '@jetlinks-web/utils'
import {NOT_FIND_ROUTE, LOGIN_ROUTE, OAuth2, OAuthWechat, AccountCenterBind} from './basic'
import {useUserStore} from "@/store/user";
import {useSystemStore} from "@/store/system";
import {useMenuStore} from "@/store/menu";
import { modules } from '@/utils/modules'

let TokenFilterRoute: string[] = [OAuth2.path, AccountCenterBind.path]

let FilterPath: string[] = [OAuth2.path]

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
    ...getModulesRoutes()
  ],
  scrollBehavior(to, form, savedPosition) {
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

  if (!Object.keys(UserInfoStore.userInfo).length) {
    // 是否有用户信息
    await UserInfoStore.getUserInfo()
    //
    await SystemStore.queryVersion()
    await SystemStore.queryInfo()
    await SystemStore.setMircoData()
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
