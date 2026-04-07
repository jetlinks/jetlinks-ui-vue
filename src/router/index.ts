import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'
import { getToken, removeToken } from '@jetlinks-web/utils'
import { isSubApp, OpenMicroApp } from '@jetlinks-web-core/utils/consts'
import { useApplication, useUserStore, useSystemStore, useMenuStore } from '@jetlinks-web-core/store'
import microApp from '@micro-zoe/micro-app'
import { collectCoreRouteOverrides } from './globModules'
import { resolveCoreRoutes } from './coreRoutes'
import { RouteSecurityLevel } from './types'
import { toValue } from 'vue'

let isLock = false

// ============ 核心路由解析 ============
const moduleOverrides = collectCoreRouteOverrides()
const {
  routes: coreRoutes,
  tokenFilterPaths,
  menuFilterPaths,
  registry
} = resolveCoreRoutes(moduleOverrides)

// 输出调试信息
if (import.meta.env.DEV) {
  console.log('[Router] 核心路由配置:', {
    coreRoutes: registry.map(r => r.name),
    tokenFilterPaths,
    menuFilterPaths
  })
}

// ============ 创建Router ============
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...coreRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

microApp.router.setBaseAppRouter(router)

// ============ 路由守卫优化 ============

/**
 * 检查路由是否需要token验证
 *
 * 优先级:
 * 1. meta.security === PUBLIC -> 无需token
 * 2. 匹配 tokenFilterPaths（支持动态参数）
 * 3. 默认需要token
 */
function isPublicRoute(to: RouteLocationNormalized): boolean {
  // 方式1: 检查meta配置（推荐）
  if (to.matched.some(record => record.meta.security === RouteSecurityLevel.PUBLIC)) {
    return true
  }

  // 方式2: 精确路径匹配（兼容旧代码）
  if (tokenFilterPaths.includes(to.path)) {
    return true
  }

  // 方式3: 动态路由参数匹配
  // 例如: /edge/token/:id 匹配 /edge/token/123
  return tokenFilterPaths.some(filterPath => {
    if (!filterPath.includes(':')) return false
    const regex = new RegExp('^' + filterPath.replace(/:\w+/g, '[^/]+') + '$')
    return regex.test(to.path)
  })
}

/**
 * 检查是否跳过菜单权限检查
 */
function shouldSkipMenuFetch(to: RouteLocationNormalized): boolean {
  // 精确匹配
  if (menuFilterPaths.includes(to.path)) {
    return true
  }

  // meta配置匹配
  return to.matched.some(record => record.meta.skipMenuFetch === true)
}

/**
 * 无Token时的跳转逻辑
 */
const NoTokenJump = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  isLoginRoute: boolean
) => {
  if (isLoginRoute || isPublicRoute(to)) {
    next()
  } else {
    // 查找登录路由
    const loginRoute = coreRoutes.find(r => r.name === 'Login')
    next({ path: loginRoute?.path || '/login' })
  }
}

/**
 * 获取服务端路由（菜单权限）
 */
const getRoutesByServer = async (
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const UserInfoStore = useUserStore()
  const SystemStore = useSystemStore()
  const MenuStore = useMenuStore()
  const application = useApplication()

  if (!Object.keys(UserInfoStore.userInfo).length) {
    await UserInfoStore.getUserInfo()
    await SystemStore.queryVersion()
    await SystemStore.getShowThreshold()
    await SystemStore.queryInfo()
    await SystemStore.setMircoData()
  }

  if (!isSubApp && !application.appList.length && OpenMicroApp) {
    await application.queryApplication()
  }

  // 优化: 使用新的过滤检查
  if (!MenuStore.menu.length && !shouldSkipMenuFetch(to) && !isLock) {
    await MenuStore.queryMenus()
    if (!MenuStore.menu) {
      isLock = true
      next()
    } else {
      isLock = false
      MenuStore.menu.forEach((r) => {
        router.addRoute(r)
      })
      router.addRoute({
        path: "/:pathMatch(.*)*",
        name: "error",
        component: () => import("@jetlinks-web-core/views/Error/404.vue"),
        meta: {
          title: "404",
        },
      })
      await next({ ...to, replace: true })
    }
  } else {
    next()
  }
}

// ============ 全局守卫 ============
router.beforeEach((to, from, next) => {
  const token = getToken()
  // 优化: 使用路由名称判断（更可靠）
  const isLoginRoute = to.name === 'Login'

  if (token) {
    if (isLoginRoute) {
      isLock = false
      next({ path: '/' })
    } else {
      getRoutesByServer(to, next)
    }
  } else {
    isLock = false
    NoTokenJump(to, next, isLoginRoute)
  }
})


export const jumpLogin = () => {
  const currentRoute = toValue(router.currentRoute)

  // 优化: 使用新的公开路由检查
  if (isPublicRoute(currentRoute)) return

  setTimeout(() => {
    removeToken()
    const loginRoute = coreRoutes.find(r => r.name === 'Login')
    router.replace({
      path: loginRoute?.path || '/login',
    })
  })
}

export default router
