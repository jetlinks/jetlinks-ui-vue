import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {uiList} from "@/api/application";
import {OpenMicroApp} from "@/utils/consts";
import { microFrontendConfig, MicroAppStatus } from '@/configs/micro-frontend-config'
import { federationStrategy } from '@/configs/federation-strategy'
import { federationBridge } from '@/utils/micro-federation-bridge'
import { preloader, PreloadStrategy } from '@/utils/federation-preloader'
import { performanceMonitor } from '@/utils/federation-performance-monitor'

type ApplicationItemType = {
  id: string
  path: string
  name: string
  version?: string
  description?: string
  enabled?: boolean
  status?: MicroAppStatus
  loadTime?: number
  lastActive?: number
}

export const useApplication = defineStore('application', () => {
  const appList = ref<Array<ApplicationItemType>>([])
  const loadingApps = ref<Set<string>>(new Set())
  const errorApps = ref<Map<string, string>>(new Map())
  let lock = false

  // 计算属性：活跃的应用列表
  const activeApps = computed(() => 
    appList.value.filter(app => app.enabled !== false && app.status !== MicroAppStatus.ERROR)
  )

  // 计算属性：已加载的应用数量
  const loadedAppsCount = computed(() => 
    appList.value.filter(app => app.status === MicroAppStatus.LOADED || app.status === MicroAppStatus.MOUNTED).length
  )

  // 计算属性：应用统计信息
  const appStats = computed(() => ({
    total: appList.value.length,
    active: activeApps.value.length,
    loaded: loadedAppsCount.value,
    loading: loadingApps.value.size,
    error: errorApps.value.size
  }))

  /**
   * 查询应用列表
   */
  const queryApplication = async () => {
    if (appList.value.length > 0 || OpenMicroApp === 'false') return

    if (lock) return
    lock = true

    try {
      const resp = await uiList()
      if (resp.success && resp.result) {
        // 处理应用数据，添加默认状态
        const applications = resp.result.map((app: ApplicationItemType) => ({
          ...app,
          enabled: app.enabled !== false,
          status: MicroAppStatus.IDLE,
          lastActive: Date.now()
        }))
        
        appList.value = applications
        
        // 初始化微前端配置
        await initializeMicroFrontend(applications)
        
        // 发布应用列表更新事件
        federationBridge.emit('applications:updated', 'application-store', {
          applications,
          count: applications.length
        })

        console.log(`已加载 ${applications.length} 个微前端应用`)
      }
    } catch (error) {
      console.error('查询应用列表失败:', error)
      throw error
    } finally {
      lock = false
    }
  }

  /**
   * 初始化微前端配置
   */
  const initializeMicroFrontend = async (applications: ApplicationItemType[]) => {
    try {
      // 初始化微前端配置管理器
      await microFrontendConfig.initialize(applications)
      
      // 生成federation策略配置
      federationStrategy.generateFederationConfig(applications)
      
      // 设置预加载任务
      applications.forEach(app => {
        if (app.enabled !== false) {
          preloader.addTask(app.id, {
            strategy: PreloadStrategy.IDLE,
            priority: 5
          })
        }
      })

      console.log('微前端配置初始化完成')
    } catch (error) {
      console.error('微前端配置初始化失败:', error)
    }
  }

  /**
   * 根据ID查找应用
   */
  const findAppById = (appId: string) => appList.value.find((item: any) => item.id === appId)

  /**
   * 预加载应用
   */
  const preloadApp = async (appId: string): Promise<boolean> => {
    const app = findAppById(appId)
    if (!app || !app.enabled) {
      return false
    }

    if (loadingApps.value.has(appId)) {
      return false
    }

    loadingApps.value.add(appId)
    updateAppStatus(appId, MicroAppStatus.LOADING)

    const monitorId = performanceMonitor.startLoading(`app_preload_${appId}`)

    try {
      await microFrontendConfig.preloadApp(appId)
      
      updateAppStatus(appId, MicroAppStatus.LOADED)
      app.loadTime = Date.now()
      
      performanceMonitor.endLoading(monitorId)
      
      // 发布应用预加载完成事件
      federationBridge.emit('app:preloaded', 'application-store', {
        appId,
        loadTime: app.loadTime
      })

      console.log(`应用 ${appId} 预加载完成`)
      return true

    } catch (error) {
      const errorMessage = (error as Error).message
      errorApps.value.set(appId, errorMessage)
      updateAppStatus(appId, MicroAppStatus.ERROR)
      
      performanceMonitor.endLoadingWithError(monitorId, error as Error)
      
      // 发布应用预加载失败事件
      federationBridge.emit('app:preload-failed', 'application-store', {
        appId,
        error: errorMessage
      })

      console.error(`应用 ${appId} 预加载失败:`, error)
      return false

    } finally {
      loadingApps.value.delete(appId)
    }
  }

  /**
   * 批量预加载应用
   */
  const batchPreloadApps = async (appIds?: string[]): Promise<void> => {
    const targetApps = appIds || activeApps.value.map(app => app.id)
    
    const promises = targetApps.map(appId => 
      preloadApp(appId).catch(() => false)
    )
    
    await Promise.allSettled(promises)
  }

  /**
   * 更新应用状态
   */
  const updateAppStatus = (appId: string, status: MicroAppStatus): void => {
    const app = findAppById(appId)
    if (app) {
      app.status = status
      app.lastActive = Date.now()
      
      // 同步更新微前端配置
      microFrontendConfig.updateAppStatus(appId, status)
    }
  }

  /**
   * 启用/禁用应用
   */
  const setAppEnabled = (appId: string, enabled: boolean): void => {
    const app = findAppById(appId)
    if (app) {
      app.enabled = enabled
      
      // 同步更新微前端配置
      microFrontendConfig.setAppEnabled(appId, enabled)
      
      // 发布应用状态变更事件
      federationBridge.emit('app:enabled-changed', 'application-store', {
        appId,
        enabled
      })

      console.log(`应用 ${appId} ${enabled ? '已启用' : '已禁用'}`)
    }
  }

  /**
   * 重新加载应用
   */
  const reloadApp = async (appId: string): Promise<boolean> => {
    const app = findAppById(appId)
    if (!app) {
      return false
    }

    // 清除错误状态
    errorApps.value.delete(appId)
    
    // 重置状态
    updateAppStatus(appId, MicroAppStatus.IDLE)
    
    // 重新预加载
    return await preloadApp(appId)
  }

  /**
   * 获取应用性能信息
   */
  const getAppPerformance = (appId: string) => {
    const app = findAppById(appId)
    if (!app) return null

    return {
      loadTime: app.loadTime,
      lastActive: app.lastActive,
      status: app.status,
      error: errorApps.value.get(appId)
    }
  }

  /**
   * 获取所有应用的性能统计
   */
  const getPerformanceStats = () => {
    const stats = performanceMonitor.getStats()
    const microStats = microFrontendConfig.getStats()
    
    return {
      ...stats,
      microFrontend: microStats,
      applications: appStats.value
    }
  }

  /**
   * 清理应用缓存
   */
  const clearAppCache = (appId?: string): void => {
    if (appId) {
      // 清理指定应用的缓存
      const app = findAppById(appId)
      if (app && app.status !== MicroAppStatus.LOADING) {
        app.loadTime = undefined
        updateAppStatus(appId, MicroAppStatus.IDLE)
      }
    } else {
      // 清理所有应用缓存
      appList.value.forEach(app => {
        if (app.status !== MicroAppStatus.LOADING) {
          app.loadTime = undefined
          app.status = MicroAppStatus.IDLE
        }
      })
    }
    
    // 清理微前端配置缓存
    microFrontendConfig.clear()
  }

  /**
   * 检查应用是否就绪
   */
  const isAppReady = (appId: string): boolean => {
    const app = findAppById(appId)
    if (!app || !app.enabled) return false
    
    return app.status === MicroAppStatus.LOADED || app.status === MicroAppStatus.MOUNTED
  }

  /**
   * 获取就绪的应用列表
   */
  const getReadyApps = (): ApplicationItemType[] => {
    return appList.value.filter(app => isAppReady(app.id))
  }

  // 设置事件监听器
  federationBridge.on('micro-app:mounted', (event) => {
    const { appId } = event.payload
    updateAppStatus(appId, MicroAppStatus.MOUNTED)
  })

  federationBridge.on('micro-app:unmounted', (event) => {
    const { appId } = event.payload
    updateAppStatus(appId, MicroAppStatus.IDLE)
  })

  return {
    // 状态
    appList,
    loadingApps: computed(() => Array.from(loadingApps.value)),
    errorApps: computed(() => Object.fromEntries(errorApps.value)),
    activeApps,
    loadedAppsCount,
    appStats,
    
    // 方法
    queryApplication,
    findAppById,
    preloadApp,
    batchPreloadApps,
    updateAppStatus,
    setAppEnabled,
    reloadApp,
    getAppPerformance,
    getPerformanceStats,
    clearAppCache,
    isAppReady,
    getReadyApps
  }
})
