/**
 * 模块联邦策略配置
 * 用于动态配置和管理模块联邦的远程应用
 */

// 模块联邦配置接口
export interface FederationRemoteConfig {
  /** 应用名称 */
  name: string
  /** 远程入口地址 */
  entry: string
  /** 模块格式 */
  format?: 'esm' | 'systemjs' | 'var'
  /** 来源类型 */
  from?: 'vite' | 'webpack'
  /** 共享作用域 */
  shareScope?: string
  /** 是否预加载 */
  preload?: boolean
  /** 超时时间(ms) */
  timeout?: number
}

// 应用配置映射
export interface ApplicationConfig {
  /** 应用ID */
  id: string
  /** 应用名称 */
  name: string
  /** 基础路径 */
  path: string
  /** federation配置 */
  federation?: FederationRemoteConfig
  /** 是否启用 */
  enabled?: boolean
}

/**
 * Federation 策略管理器
 */
export class FederationStrategy {
  private static instance: FederationStrategy
  private remoteConfigs = new Map<string, FederationRemoteConfig>()
  private applicationConfigs = new Map<string, ApplicationConfig>()

  private constructor() {}

  public static getInstance(): FederationStrategy {
    if (!FederationStrategy.instance) {
      FederationStrategy.instance = new FederationStrategy()
    }
    return FederationStrategy.instance
  }

  /**
   * 注册远程应用配置
   */
  public registerRemote(config: FederationRemoteConfig): void {
    this.remoteConfigs.set(config.name, {
      format: 'esm',
      from: 'vite',
      preload: false,
      timeout: 30000,
      ...config
    })
  }

  /**
   * 批量注册远程应用
   */
  public batchRegisterRemotes(configs: FederationRemoteConfig[]): void {
    configs.forEach(config => this.registerRemote(config))
  }

  /**
   * 注册应用配置
   */
  public registerApplication(config: ApplicationConfig): void {
    this.applicationConfigs.set(config.id, {
      enabled: true,
      ...config
    })
  }

  /**
   * 获取远程应用配置
   */
  public getRemoteConfig(name: string): FederationRemoteConfig | undefined {
    return this.remoteConfigs.get(name)
  }

  /**
   * 获取应用配置
   */
  public getApplicationConfig(id: string): ApplicationConfig | undefined {
    return this.applicationConfigs.get(id)
  }

  /**
   * 获取所有远程应用配置
   */
  public getAllRemoteConfigs(): Map<string, FederationRemoteConfig> {
    return new Map(this.remoteConfigs)
  }

  /**
   * 获取所有应用配置
   */
  public getAllApplicationConfigs(): Map<string, ApplicationConfig> {
    return new Map(this.applicationConfigs)
  }

  /**
   * 根据应用列表动态生成federation配置
   */
  public generateFederationConfig(applications: Array<{id: string, path: string, name: string}>): void {
    applications.forEach(app => {
      // 生成federation远程配置
      const federationConfig: FederationRemoteConfig = {
        name: app.id,
        entry: `${app.path}remoteEntry.js`,
        format: 'esm',
        from: 'vite',
        preload: false
      }

      // 注册配置
      this.registerRemote(federationConfig)
      
      // 注册应用配置
      this.registerApplication({
        id: app.id,
        name: app.name,
        path: app.path,
        federation: federationConfig,
        enabled: true
      })
    })
  }

  /**
   * 清空所有配置
   */
  public clear(): void {
    this.remoteConfigs.clear()
    this.applicationConfigs.clear()
  }

  /**
   * 检查远程应用是否已注册
   */
  public hasRemote(name: string): boolean {
    return this.remoteConfigs.has(name)
  }

  /**
   * 移除远程应用配置
   */
  public removeRemote(name: string): boolean {
    return this.remoteConfigs.delete(name)
  }
}

// 导出单例实例
export const federationStrategy = FederationStrategy.getInstance()

// 默认配置
export const DEFAULT_FEDERATION_CONFIG: Partial<FederationRemoteConfig> = {
  format: 'esm',
  from: 'vite',
  shareScope: 'default',
  preload: false,
  timeout: 30000
}