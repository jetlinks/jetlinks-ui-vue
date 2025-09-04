/**
 * 模块联邦类型定义
 * 兼容vite7的模块联邦实现
 */

export interface FederationConfig {
  /** 应用名称 */
  name: string
  /** 文件名 */
  filename?: string
  /** 暴露的模块 */
  exposes?: Record<string, string>
  /** 远程应用配置 */
  remotes?: Record<string, string>
  /** 共享模块 */
  shared?: Record<string, SharedConfig | boolean>
}

export interface SharedConfig {
  /** 是否单例 */
  singleton?: boolean
  /** 是否严格版本 */
  strictVersion?: boolean
  /** 版本要求 */
  requiredVersion?: string
  /** 是否即刻加载 */
  eager?: boolean
}

export interface RemoteComponentConfig {
  /** 远程应用名 */
  remoteName: string
  /** 组件路径 */
  exposedModule: string
  /** 远程地址 */
  url: string
  /** 组件名称 */
  componentName?: string
}

export interface FederationPluginOptions extends FederationConfig {
  /** 开发模式下的端口 */
  devPort?: number
  /** 构建目录 */
  buildTarget?: string
  /** 是否启用缓存 */
  cache?: boolean
  /** 自定义webpack配置 */
  webpack?: any
}

export interface RemoteModuleInfo {
  /** 模块ID */
  id: string
  /** 远程URL */
  url: string
  /** 状态 */
  status: 'loading' | 'loaded' | 'error'
  /** 模块导出 */
  module?: any
  /** 错误信息 */
  error?: Error
}

export interface FederationRuntime {
  /** 加载远程模块 */
  loadRemote: (remoteName: string, moduleName: string) => Promise<any>
  /** 预加载远程模块 */
  preloadRemote: (remoteName: string) => Promise<void>
  /** 获取远程模块信息 */
  getRemoteInfo: (remoteName: string) => RemoteModuleInfo | undefined
  /** 清除缓存 */
  clearCache: (remoteName?: string) => void
}