/**
 * 微前端路由增强器
 * 优化路由系统以适配模块联邦和微前端应用
 */

import type { Router, RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { microFrontendConfig } from '@/configs/micro-frontend-config'
import { federationBridge } from '@/utils/micro-federation-bridge'
import { preloader, PreloadStrategy } from '@/utils/federation-preloader'
import { performanceMonitor } from '@/utils/federation-performance-monitor'

// 微前端路由配置
export interface MicroRouteConfig {
  /** 应用ID */
  appId: string
  /** 路由前缀 */
  prefix: string
  /** 是否预加载 */
  preload?: boolean
  /** 预加载策略 */
  preloadStrategy?: PreloadStrategy
  /** 路由守卫 */
  guards?: {
    beforeEnter?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean | Promise<boolean>
    afterEnter?: (to: RouteLocationNormalized, from: RouteLocationNormalized) => void
  }
  /** 权限控制 */
  permissions?: string[]
  /** 是否启用 */
  enabled?: boolean
}

// 路由匹配结果
export interface RouteMatchResult {
  matched: boolean
  appId?: string
  config?: MicroRouteConfig
  route?: RouteRecordRaw
}

/**
 * 微前端路由增强器
 */
export class MicroRouterEnhancer {
  private router: Router
  private microRoutes = new Map<string, MicroRouteConfig>()
  private routeCache = new Map<string, RouteRecordRaw>()
  private loadingRoutes = new Set<string>()

  constructor(router: Router) {
    this.router = router
    this.setupRouterGuards()
    this.setupEventListeners()
  }

  /**
   * 注册微前端路由配置
   */
  public registerMicroRoute(config: MicroRouteConfig): void {
    this.microRoutes.set(config.appId, {
      preload: false,
      preloadStrategy: PreloadStrategy.IDLE,
      enabled: true,
      ...config
    })

    // 如果需要预加载，添加预加载任务
    if (config.preload) {
      preloader.addTask(config.appId, {
        strategy: config.preloadStrategy || PreloadStrategy.IDLE,
        priority: 7
      })
    }

    console.log(`微前端路由注册: ${config.appId} -> ${config.prefix}`)
  }

  /**
   * 批量注册微前端路由
   */
  public registerMicroRoutes(configs: MicroRouteConfig[]): void {
    configs.forEach(config => this.registerMicroRoute(config))
  }

  /**
   * 检查路由是否匹配微前端应用
   */
  public matchMicroRoute(path: string): RouteMatchResult {
    for (const [appId, config] of this.microRoutes) {
      if (!config.enabled) continue
      
      if (path.startsWith(config.prefix)) {
        return {
          matched: true,
          appId,
          config
        }
      }
    }

    return { matched: false }
  }

  /**
   * 动态加载微前端路由
   */
  public async loadMicroRoutes(appId: string): Promise<RouteRecordRaw[]> {
    const config = this.microRoutes.get(appId)
    if (!config) {
      throw new Error(`未找到应用 ${appId} 的路由配置`)
    }

    // 检查缓存
    const cacheKey = `routes_${appId}`
    if (this.routeCache.has(cacheKey)) {
      return this.routeCache.get(cacheKey)!
    }

    // 避免重复加载
    if (this.loadingRoutes.has(appId)) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.loadingRoutes.has(appId) && this.routeCache.has(cacheKey)) {
            clearInterval(checkInterval)
            resolve(this.routeCache.get(cacheKey)!)
          }
        }, 100)
      })
    }

    this.loadingRoutes.add(appId)
    const monitorId = performanceMonitor.startLoading(`route_load_${appId}`)

    try {
      // 确保应用已加载
      if (!microFrontendConfig.isAppReady(appId)) {
        await microFrontendConfig.preloadApp(appId)
      }

      // 从模块注册中心获取路由
      const { moduleRegistry } = await import('@/utils/module-registry')
      const routes = moduleRegistry.getResource(appId, 'routes') as RouteRecordRaw[] || []

      // 处理路由前缀
      const processedRoutes = this.processRoutes(routes, config)

      // 缓存路由
      this.routeCache.set(cacheKey, processedRoutes)

      performanceMonitor.endLoading(monitorId)
      
      // 发布路由加载完成事件
      federationBridge.emit('micro-route:loaded', 'router-enhancer', {
        appId,
        routeCount: processedRoutes.length
      })

      return processedRoutes

    } catch (error) {
      performanceMonitor.endLoadingWithError(monitorId, error as Error)
      
      // 发布路由加载失败事件
      federationBridge.emit('micro-route:load-failed', 'router-enhancer', {
        appId,
        error: (error as Error).message
      })

      throw error

    } finally {
      this.loadingRoutes.delete(appId)
    }
  }

  /**
   * 处理路由配置
   */
  private processRoutes(routes: RouteRecordRaw[], config: MicroRouteConfig): RouteRecordRaw[] {
    return routes.map(route => {
      // 处理路径前缀
      const processedRoute: RouteRecordRaw = {
        ...route,
        path: this.addPrefix(route.path, config.prefix)
      }

      // 添加路由守卫
      if (config.guards?.beforeEnter) {
        const originalBeforeEnter = processedRoute.beforeEnter
        processedRoute.beforeEnter = async (to, from, next) => {
          try {
            const canEnter = await config.guards!.beforeEnter!(to, from)
            if (canEnter) {
              if (originalBeforeEnter) {
                if (typeof originalBeforeEnter === 'function') {
                  originalBeforeEnter(to, from, next)
                } else if (Array.isArray(originalBeforeEnter)) {
                  // 处理守卫数组
                  for (const guard of originalBeforeEnter) {
                    await guard(to, from, next)
                  }
                }
              } else {
                next()
              }
            } else {
              next(false)
            }
          } catch (error) {
            console.error(`路由守卫执行失败 ${route.path}:`, error)
            next(false)
          }
        }
      }

      // 处理子路由
      if (route.children) {
        processedRoute.children = this.processRoutes(route.children, config)
      }

      return processedRoute
    })
  }

  /**
   * 添加路径前缀
   */
  private addPrefix(path: string, prefix: string): string {
    // 确保前缀以 / 开头，不以 / 结尾
    const normalizedPrefix = prefix.startsWith('/') ? prefix : `/${prefix}`
    const cleanPrefix = normalizedPrefix.endsWith('/') ? normalizedPrefix.slice(0, -1) : normalizedPrefix

    // 处理根路径
    if (path === '/') {
      return cleanPrefix
    }

    // 处理绝对路径
    if (path.startsWith('/')) {
      return `${cleanPrefix}${path}`
    }

    // 处理相对路径
    return `${cleanPrefix}/${path}`
  }

  /**
   * 动态添加路由到路由器
   */
  public async addMicroRoutesToRouter(appId: string): Promise<void> {
    try {
      const routes = await this.loadMicroRoutes(appId)
      
      routes.forEach(route => {
        this.router.addRoute(route)
      })

      console.log(`已添加 ${routes.length} 个微前端路由: ${appId}`)

    } catch (error) {
      console.error(`添加微前端路由失败 ${appId}:`, error)
      throw error
    }
  }

  /**
   * 移除微前端路由
   */
  public removeMicroRoutes(appId: string): void {
    const config = this.microRoutes.get(appId)
    if (!config) return

    // 移除路由器中的路由
    const routes = this.router.getRoutes()
    routes.forEach(route => {
      if (route.path.startsWith(config.prefix)) {
        this.router.removeRoute(route.name!)
      }
    })

    // 清除缓存
    this.routeCache.delete(`routes_${appId}`)
    
    console.log(`已移除微前端路由: ${appId}`)
  }

  /**
   * 设置路由器守卫
   */
  private setupRouterGuards(): void {
    // 前置守卫：检查是否需要加载微前端路由
    this.router.beforeEach(async (to, from, next) => {
      const matchResult = this.matchMicroRoute(to.path)
      
      if (matchResult.matched && matchResult.appId) {
        const appId = matchResult.appId
        
        try {
          // 检查路由是否已加载
          const hasRoutes = this.routeCache.has(`routes_${appId}`)
          
          if (!hasRoutes) {
            // 动态加载路由
            await this.addMicroRoutesToRouter(appId)
            
            // 重新导航到目标路由
            next({ ...to, replace: true })
            return
          }

          // 执行权限检查
          if (matchResult.config?.permissions) {
            const hasPermission = await this.checkPermissions(matchResult.config.permissions)
            if (!hasPermission) {
              console.warn(`无权限访问: ${to.path}`)
              next({ name: 'NotFound' })
              return
            }
          }

          // 发布路由变化事件
          federationBridge.emit('route:changed', 'router-enhancer', {
            to: to.path,
            from: from.path,
            appId
          })

          next()

        } catch (error) {
          console.error(`路由加载失败 ${appId}:`, error)
          next({ name: 'NotFound' })
        }
      } else {
        next()
      }
    })

    // 后置守卫：执行路由切换后的操作
    this.router.afterEach((to, from) => {
      const matchResult = this.matchMicroRoute(to.path)
      
      if (matchResult.matched && matchResult.config?.guards?.afterEnter) {
        try {
          matchResult.config.guards.afterEnter(to, from)
        } catch (error) {
          console.error('路由后置守卫执行失败:', error)
        }
      }
    })
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 监听应用卸载事件
    federationBridge.on('app:unmounted', (event) => {
      const { appId } = event.payload
      this.removeMicroRoutes(appId)
    })
  }

  /**
   * 检查权限
   */
  private async checkPermissions(permissions: string[]): Promise<boolean> {
    // 这里应该实现具体的权限检查逻辑
    // 可以从用户store或权限service中获取用户权限
    try {
      const { useUserStore } = await import('@/store')
      const userStore = useUserStore()
      
      // 假设用户store中有permissions数组
      const userPermissions = userStore.userInfo?.permissions || []
      
      return permissions.every(permission => userPermissions.includes(permission))
    } catch (error) {
      console.error('权限检查失败:', error)
      return false
    }
  }

  /**
   * 预热路由
   */
  public async preloadRoutes(appIds: string[]): Promise<void> {
    const promises = appIds.map(appId => this.loadMicroRoutes(appId).catch(() => null))
    await Promise.allSettled(promises)
  }

  /**
   * 获取路由统计信息
   */
  public getStats() {
    return {
      registeredApps: this.microRoutes.size,
      cachedRoutes: this.routeCache.size,
      loadingRoutes: this.loadingRoutes.size,
      routeConfigs: Array.from(this.microRoutes.entries()).map(([appId, config]) => ({
        appId,
        prefix: config.prefix,
        enabled: config.enabled,
        preload: config.preload
      }))
    }
  }

  /**
   * 清理缓存
   */
  public clearCache(appId?: string): void {
    if (appId) {
      this.routeCache.delete(`routes_${appId}`)
    } else {
      this.routeCache.clear()
    }
  }
}

// 创建路由增强器实例的工厂函数
export function createMicroRouterEnhancer(router: Router): MicroRouterEnhancer {
  return new MicroRouterEnhancer(router)
}

export default MicroRouterEnhancer