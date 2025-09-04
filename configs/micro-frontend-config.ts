/**
 * 微前端配置管理
 * 统一管理微前端应用的配置和生命周期
 */

import { federationStrategy, type ApplicationConfig, type FederationRemoteConfig } from './federation-strategy'

// 微前端应用状态
export enum MicroAppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  UNMOUNTING = 'unmounting',
  ERROR = 'error'
}

// 微前端应用信息
export interface MicroAppInfo extends ApplicationConfig {
  status: MicroAppStatus
  error?: Error
  loadTime?: number
  mountTime?: number
}

/**
 * 微前端配置管理器
 */
export class MicroFrontendConfig {
  private static instance: MicroFrontendConfig
  private apps = new Map<string, MicroAppInfo>()
  private loadPromises = new Map<string, Promise<void>>()

  private constructor() {}

  public static getInstance(): MicroFrontendConfig {
    if (!MicroFrontendConfig.instance) {
      MicroFrontendConfig.instance = new MicroFrontendConfig()
    }
    return MicroFrontendConfig.instance
  }

  /**
   * 初始化微前端配置
   */
  public async initialize(applications: Array<{id: string, path: string, name: string}>): Promise<void> {
    // 清空现有配置
    this.clear()
    
    // 生成federation配置
    federationStrategy.generateFederationConfig(applications)
    
    // 初始化应用信息
    applications.forEach(app => {
      const appConfig = federationStrategy.getApplicationConfig(app.id)
      if (appConfig) {
        this.apps.set(app.id, {
          ...appConfig,
          status: MicroAppStatus.IDLE
        })
      }
    })

    console.log('微前端配置初始化完成', this.apps)
  }

  /**
   * 获取应用信息
   */
  public getAppInfo(appId: string): MicroAppInfo | undefined {
    return this.apps.get(appId)
  }

  /**
   * 获取所有应用信息
   */
  public getAllApps(): Map<string, MicroAppInfo> {
    return new Map(this.apps)
  }

  /**
   * 更新应用状态
   */
  public updateAppStatus(appId: string, status: MicroAppStatus, error?: Error): void {
    const app = this.apps.get(appId)
    if (app) {
      app.status = status
      if (error) {
        app.error = error
      }
      
      // 记录时间戳
      if (status === MicroAppStatus.LOADED) {
        app.loadTime = Date.now()
      } else if (status === MicroAppStatus.MOUNTED) {
        app.mountTime = Date.now()
      }
      
      this.apps.set(appId, app)
      console.log(`应用 ${appId} 状态更新为: ${status}`)
    }
  }

  /**
   * 预加载应用
   */
  public async preloadApp(appId: string): Promise<void> {
    const app = this.apps.get(appId)
    if (!app || app.status !== MicroAppStatus.IDLE) {
      return
    }

    // 避免重复加载
    if (this.loadPromises.has(appId)) {
      return this.loadPromises.get(appId)
    }

    const loadPromise = this.doPreload(appId)
    this.loadPromises.set(appId, loadPromise)
    
    try {
      await loadPromise
    } finally {
      this.loadPromises.delete(appId)
    }
  }

  /**
   * 执行预加载
   */
  private async doPreload(appId: string): Promise<void> {
    const app = this.apps.get(appId)
    if (!app?.federation) {
      throw new Error(`应用 ${appId} 的federation配置不存在`)
    }

    this.updateAppStatus(appId, MicroAppStatus.LOADING)

    try {
      // 动态导入federation loader
      const { preloadRemoteComponents } = await import('../src/utils/remote-component-loader')
      
      // 预加载远程应用
      await preloadRemoteComponents([{ remoteName: app.federation.name }])
      
      this.updateAppStatus(appId, MicroAppStatus.LOADED)
    } catch (error) {
      this.updateAppStatus(appId, MicroAppStatus.ERROR, error as Error)
      throw error
    }
  }

  /**
   * 批量预加载应用
   */
  public async preloadApps(appIds: string[]): Promise<void> {
    const promises = appIds.map(id => this.preloadApp(id))
    await Promise.allSettled(promises)
  }

  /**
   * 检查应用是否可用
   */
  public isAppReady(appId: string): boolean {
    const app = this.apps.get(appId)
    return app?.status === MicroAppStatus.LOADED || app?.status === MicroAppStatus.MOUNTED
  }

  /**
   * 获取应用的federation配置
   */
  public getAppFederationConfig(appId: string): FederationRemoteConfig | undefined {
    return this.apps.get(appId)?.federation
  }

  /**
   * 启用/禁用应用
   */
  public setAppEnabled(appId: string, enabled: boolean): void {
    const app = this.apps.get(appId)
    if (app) {
      app.enabled = enabled
      this.apps.set(appId, app)
    }
  }

  /**
   * 清空所有配置
   */
  public clear(): void {
    this.apps.clear()
    this.loadPromises.clear()
    federationStrategy.clear()
  }

  /**
   * 获取应用统计信息
   */
  public getStats() {
    const total = this.apps.size
    const loaded = Array.from(this.apps.values()).filter(app => app.status === MicroAppStatus.LOADED).length
    const error = Array.from(this.apps.values()).filter(app => app.status === MicroAppStatus.ERROR).length
    
    return {
      total,
      loaded,
      error,
      success: loaded,
      successRate: total > 0 ? (loaded / total * 100).toFixed(2) + '%' : '0%'
    }
  }
}

// 导出单例实例
export const microFrontendConfig = MicroFrontendConfig.getInstance()
