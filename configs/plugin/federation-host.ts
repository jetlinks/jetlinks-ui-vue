/**
 * 远程组件加载功能
 * 支持在任意位置动态加载远程组件
 */

import type { Plugin } from 'vite'
import type { FederationConfig, RemoteModuleInfo, FederationRuntime } from './federation-types'
import {
  generateRemoteEntry,
  importRemoteModule,
  createCacheKey,
  validateRemoteUrl,
  parseRemoteName,
  withErrorHandling,
  retry
} from './federation-utils'

/**
 * 远程模块缓存
 */
class RemoteModuleCache {
  private cache = new Map<string, RemoteModuleInfo>()
  private loadingPromises = new Map<string, Promise<any>>()

  get(key: string): RemoteModuleInfo | undefined {
    return this.cache.get(key)
  }

  set(key: string, info: RemoteModuleInfo): void {
    this.cache.set(key, info)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): void {
    this.cache.delete(key)
    this.loadingPromises.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.loadingPromises.clear()
  }

  setLoadingPromise(key: string, promise: Promise<any>): void {
    this.loadingPromises.set(key, promise)
  }

  getLoadingPromise(key: string): Promise<any> | undefined {
    return this.loadingPromises.get(key)
  }
}

/**
 * 联邦运行时实现
 */
class FederationRuntimeImpl implements FederationRuntime {
  private cache = new RemoteModuleCache()
  private remotes: Record<string, string> = {}

  constructor(remotes: Record<string, string> = {}) {
    this.remotes = remotes
  }

  async loadRemote(remoteName: string, moduleName: string): Promise<any> {
    const cacheKey = createCacheKey(remoteName, moduleName)
    
    // 检查缓存
    let cached = this.cache.get(cacheKey)
    if (cached?.status === 'loaded') {
      return cached.module
    }

    // 检查是否正在加载
    const existingPromise = this.cache.getLoadingPromise(cacheKey)
    if (existingPromise) {
      return existingPromise
    }

    // 开始加载
    const loadPromise = this.doLoadRemote(remoteName, moduleName)
    this.cache.setLoadingPromise(cacheKey, loadPromise)

    try {
      const module = await loadPromise
      
      // 更新缓存
      this.cache.set(cacheKey, {
        id: cacheKey,
        url: this.getRemoteUrl(remoteName),
        status: 'loaded',
        module
      })
      
      return module
    } catch (error) {
      // 更新错误状态
      this.cache.set(cacheKey, {
        id: cacheKey,
        url: this.getRemoteUrl(remoteName),
        status: 'error',
        error: error as Error
      })
      
      throw error
    }
  }

  private async doLoadRemote(remoteName: string, moduleName: string): Promise<any> {
    const remoteUrl = this.getRemoteUrl(remoteName)
    
    if (!validateRemoteUrl(remoteUrl)) {
      throw new Error(`Invalid remote URL: ${remoteUrl}`)
    }

    // 使用重试机制加载远程入口
    const remoteContainer = await retry(async () => {
      await importRemoteModule(generateRemoteEntry(remoteUrl, remoteName))
      
      const container = (window as any)[`__federation_${remoteName}__`]
      if (!container) {
        throw new Error(`Remote container not found: ${remoteName}`)
      }
      
      return container
    }, 3, 1000)

    // 加载指定模块
    if (remoteContainer.exposes && remoteContainer.exposes[moduleName]) {
      const moduleFactory = remoteContainer.exposes[moduleName]
      if (typeof moduleFactory === 'function') {
        return await moduleFactory()
      }
    }

    throw new Error(`Module not found: ${moduleName} in remote ${remoteName}`)
  }

  async preloadRemote(remoteName: string): Promise<void> {
    const remoteUrl = this.getRemoteUrl(remoteName)
    const cacheKey = createCacheKey(remoteName)
    
    if (this.cache.has(cacheKey)) {
      return
    }

    try {
      this.cache.set(cacheKey, {
        id: cacheKey,
        url: remoteUrl,
        status: 'loading'
      })

      await importRemoteModule(generateRemoteEntry(remoteUrl, remoteName))
      
      this.cache.set(cacheKey, {
        id: cacheKey,
        url: remoteUrl,
        status: 'loaded'
      })
    } catch (error) {
      this.cache.set(cacheKey, {
        id: cacheKey,
        url: remoteUrl,
        status: 'error',
        error: error as Error
      })
      
      throw error
    }
  }

  getRemoteInfo(remoteName: string): RemoteModuleInfo | undefined {
    return this.cache.get(createCacheKey(remoteName))
  }

  clearCache(remoteName?: string): void {
    if (remoteName) {
      this.cache.delete(createCacheKey(remoteName))
    } else {
      this.cache.clear()
    }
  }

  private getRemoteUrl(remoteName: string): string {
    if (this.remotes[remoteName]) {
      return this.remotes[remoteName]
    }

    // 尝试解析格式如 "app@http://localhost:3001" 的远程名称
    if (remoteName.includes('@')) {
      const { url } = parseRemoteName(remoteName)
      return url
    }

    throw new Error(`Remote URL not found for: ${remoteName}`)
  }
}

/**
 * 创建联邦宿主插件
 */
export function createFederationHostPlugin(config: FederationConfig): Plugin {
  const { remotes = {}, shared = {} } = config
  const runtime = new FederationRuntimeImpl(remotes)

  return {
    name: 'federation-host',
    
    configResolved() {
      // 将运行时暴露到全局
      if (typeof window !== 'undefined') {
        (window as any).__federation_runtime__ = runtime
      }
    },

    transform(code, id) {
      // 转换 import 语句以支持动态联邦加载
      if (code.includes('__federation_import__')) {
        return transformFederationImports(code, runtime)
      }
    },

    generateBundle() {
      // 注入运行时代码
      this.emitFile({
        type: 'asset',
        fileName: 'federation-runtime.js',
        source: generateRuntimeCode(runtime)
      })
    }
  }
}

/**
 * 转换联邦导入语句
 */
function transformFederationImports(code: string, runtime: FederationRuntime): string {
  return code.replace(
    /__federation_import__\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]\)/g,
    (match, remoteName, moduleName) => {
      return `window.__federation_runtime__.loadRemote('${remoteName}', '${moduleName}')`
    }
  )
}

/**
 * 生成运行时代码
 */
function generateRuntimeCode(runtime: FederationRuntime): string {
  return `
// Federation Runtime
(function() {
  // 导出全局运行时
  window.__federation_runtime__ = {
    loadRemote: ${withErrorHandling.toString()},
    preloadRemote: ${withErrorHandling.toString()},
    getRemoteInfo: function(remoteName) {
      return window.__federation_runtime__.getRemoteInfo(remoteName);
    },
    clearCache: function(remoteName) {
      return window.__federation_runtime__.clearCache(remoteName);
    }
  };

  // 提供便捷的全局函数
  window.loadFederationModule = function(remoteName, moduleName) {
    return window.__federation_runtime__.loadRemote(remoteName, moduleName);
  };

  window.preloadFederationRemote = function(remoteName) {
    return window.__federation_runtime__.preloadRemote(remoteName);
  };
})();
`
}

/**
 * Vue 组件包装器
 */
export function createRemoteComponentWrapper(
  remoteName: string,
  moduleName: string,
  fallback?: any
) {
  return {
    name: `RemoteComponent-${remoteName}-${moduleName}`,
    async setup() {
      const { ref, onMounted } = await import('vue')
      const component = ref(null)
      const loading = ref(true)
      const error = ref(null)

      onMounted(async () => {
        try {
          const runtime = (window as any).__federation_runtime__ as FederationRuntime
          const remoteModule = await runtime.loadRemote(remoteName, moduleName)
          
          component.value = remoteModule.default || remoteModule
          loading.value = false
        } catch (err) {
          error.value = err
          loading.value = false
          
          if (fallback) {
            component.value = fallback
          }
        }
      })

      return {
        component,
        loading,
        error
      }
    },
    
    render() {
      if (this.loading) {
        return this.$slots.loading?.() || 'Loading remote component...'
      }
      
      if (this.error) {
        return this.$slots.error?.({ error: this.error }) || `Error: ${this.error.message}`
      }
      
      if (this.component) {
        return this.$slots.default?.({ component: this.component }) || h(this.component)
      }
      
      return null
    }
  }
}

// 导出全局运行时实例
export const federationRuntime = new FederationRuntimeImpl()

// 类型声明增强
declare global {
  interface Window {
    __federation_runtime__?: FederationRuntime
    loadFederationModule?: (remoteName: string, moduleName: string) => Promise<any>
    preloadFederationRemote?: (remoteName: string) => Promise<void>
  }
}