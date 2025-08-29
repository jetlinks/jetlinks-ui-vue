/**
 * Federation加载器
 * 提供动态加载远程组件和模块的统一接口
 */

import { microFrontendConfig, MicroAppStatus } from '@/configs/micro-frontend-config'
import { federationStrategy } from '@/configs/federation-strategy'
import type { FederationRemoteConfig } from '@/configs/federation-strategy'

// 组件加载配置
export interface ComponentLoadConfig {
  /** 远程应用名称 */
  remoteName: string
  /** 组件导出路径 */
  exposedModule: string
  /** 自定义入口URL（可选） */
  entryUrl?: string
  /** 加载超时时间 */
  timeout?: number
  /** 是否使用缓存 */
  useCache?: boolean
}

// 加载结果接口
export interface LoadResult<T = any> {
  success: boolean
  data?: T
  error?: Error
  loadTime: number
}

/**
 * Federation动态加载器
 */
export class FederationLoader {
  private static componentCache = new Map<string, any>()
  private static loadingPromises = new Map<string, Promise<any>>()

  /**
   * 动态加载远程组件
   */
  public static async loadComponent<T = any>(config: ComponentLoadConfig): Promise<LoadResult<T>> {
    const startTime = Date.now()
    const cacheKey = `${config.remoteName}::${config.exposedModule}`

    try {
      // 检查缓存
      if (config.useCache !== false && this.componentCache.has(cacheKey)) {
        return {
          success: true,
          data: this.componentCache.get(cacheKey),
          loadTime: Date.now() - startTime
        }
      }

      // 避免重复加载
      if (this.loadingPromises.has(cacheKey)) {
        const component = await this.loadingPromises.get(cacheKey)
        return {
          success: true,
          data: component,
          loadTime: Date.now() - startTime
        }
      }

      // 获取federation配置
      const federationConfig = await this.getFederationConfig(config)
      
      // 创建加载Promise
      const loadPromise = this.doLoadComponent(federationConfig, config)
      this.loadingPromises.set(cacheKey, loadPromise)

      try {
        const component = await loadPromise
        
        // 缓存组件
        if (config.useCache !== false) {
          this.componentCache.set(cacheKey, component)
        }

        return {
          success: true,
          data: component,
          loadTime: Date.now() - startTime
        }
      } finally {
        this.loadingPromises.delete(cacheKey)
      }
    } catch (error) {
      console.error(`加载远程组件失败: ${config.remoteName}/${config.exposedModule}`, error)
      return {
        success: false,
        error: error as Error,
        loadTime: Date.now() - startTime
      }
    }
  }

  /**
   * 执行组件加载
   */
  private static async doLoadComponent(
    federationConfig: FederationRemoteConfig,
    config: ComponentLoadConfig
  ): Promise<any> {
    const { loadRemoteComponent } = await import('@jetlinks-web/vite/federation/dynamic-loader')
    
    // 设置超时
    const timeout = config.timeout || federationConfig.timeout || 30000
    
    return Promise.race([
      loadRemoteComponent(
        federationConfig.name,
        config.exposedModule,
        federationConfig.entry
      ),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`加载超时: ${timeout}ms`)), timeout)
      })
    ])
  }

  /**
   * 获取federation配置
   */
  private static async getFederationConfig(config: ComponentLoadConfig): Promise<FederationRemoteConfig> {
    let federationConfig = federationStrategy.getRemoteConfig(config.remoteName)
    
    // 如果没有找到配置，尝试从微前端配置中获取
    if (!federationConfig) {
      const appInfo = microFrontendConfig.getAppInfo(config.remoteName)
      federationConfig = appInfo?.federation
    }
    
    // 如果仍然没有配置，创建临时配置
    if (!federationConfig) {
      if (!config.entryUrl) {
        throw new Error(`找不到远程应用 ${config.remoteName} 的配置，请提供 entryUrl`)
      }
      
      federationConfig = {
        name: config.remoteName,
        entry: config.entryUrl,
        format: 'esm',
        from: 'vite'
      }
    }

    // 如果提供了自定义入口URL，使用自定义URL
    if (config.entryUrl) {
      federationConfig = {
        ...federationConfig,
        entry: config.entryUrl
      }
    }

    return federationConfig
  }

  /**
   * 预加载远程应用
   */
  public static async preloadRemote(remoteName: string, entryUrl?: string): Promise<LoadResult<void>> {
    const startTime = Date.now()

    try {
      // 检查应用状态
      const appInfo = microFrontendConfig.getAppInfo(remoteName)
      if (appInfo && appInfo.status === MicroAppStatus.LOADED) {
        return {
          success: true,
          loadTime: Date.now() - startTime
        }
      }

      // 如果提供了entryUrl，注册临时配置
      if (entryUrl && !federationStrategy.hasRemote(remoteName)) {
        federationStrategy.registerRemote({
          name: remoteName,
          entry: entryUrl,
          format: 'esm',
          from: 'vite'
        })
      }

      // 预加载
      await microFrontendConfig.preloadApp(remoteName)

      return {
        success: true,
        loadTime: Date.now() - startTime
      }
    } catch (error) {
      console.error(`预加载远程应用失败: ${remoteName}`, error)
      return {
        success: false,
        error: error as Error,
        loadTime: Date.now() - startTime
      }
    }
  }

  /**
   * 批量预加载
   */
  public static async batchPreload(configs: Array<{remoteName: string, entryUrl?: string}>): Promise<LoadResult<void>[]> {
    const promises = configs.map(config => 
      this.preloadRemote(config.remoteName, config.entryUrl)
    )
    return Promise.all(promises)
  }

  /**
   * 清除组件缓存
   */
  public static clearCache(remoteName?: string): void {
    if (remoteName) {
      // 清除指定远程应用的缓存
      const keysToDelete: string[] = []
      this.componentCache.forEach((_, key) => {
        if (key.startsWith(`${remoteName}::`)) {
          keysToDelete.push(key)
        }
      })
      keysToDelete.forEach(key => this.componentCache.delete(key))
    } else {
      // 清除所有缓存
      this.componentCache.clear()
    }
  }

  /**
   * 检查远程应用是否可用
   */
  public static isRemoteReady(remoteName: string): boolean {
    return microFrontendConfig.isAppReady(remoteName)
  }

  /**
   * 获取缓存统计
   */
  public static getCacheStats() {
    return {
      cacheSize: this.componentCache.size,
      loadingCount: this.loadingPromises.size,
      cachedComponents: Array.from(this.componentCache.keys())
    }
  }
}

// 便捷方法导出
export const {
  loadComponent,
  preloadRemote,
  batchPreload,
  clearCache,
  isRemoteReady,
  getCacheStats
} = FederationLoader

export default FederationLoader